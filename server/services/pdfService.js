const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const { convert } = require('html-to-text');

const generateNotePDF = (note, res) => {
  const title = String(note?.title || 'note').trim() || 'note';
  const safeTitle = title.replace(/[^a-z0-9._-]+/gi, '_');
  const output = new PassThrough();
  const chunks = [];

  output.on('data', (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  output.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.statusCode = 200;
    res.end(pdfBuffer);
  });

  output.on('error', () => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Failed to generate PDF' }));
    }
  });

  // Create PDF document
  const doc = new PDFDocument({
    margin: 60,
    size: 'A4',
    info: {
      Title: title,
      Author: 'VaultDesk',
      Subject: 'Exported Note',
    },
  });

  doc.on('error', (error) => {
    console.error('PDF generation error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Failed to generate PDF' }));
    }
  });

  doc.pipe(output);

  // ── Header Section ────────────────────────
  // Teal accent bar at top
  doc.rect(0, 0, doc.page.width, 6).fill('#0ABFBC');

  // VaultDesk branding
  doc
    .moveDown(1)
    .fontSize(10)
    .fillColor('#94a3b8')
    .text('VaultDesk', { align: 'right' });

  // Note title
  doc
    .moveDown(0.5)
    .fontSize(28)
    .fillColor('#111827')
    .font('Helvetica-Bold')
    .text(note.title, { align: 'left' });

  // Meta info row
  doc
    .moveDown(0.5)
    .fontSize(10)
    .fillColor('#6b7280')
    .font('Helvetica')
    .text(
      `Last updated: ${new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`,
      { continued: true }
    )
    .text(
      `   Status: ${(note.revisionStatus || 'not-started').replace('-', ' ').toUpperCase()}`,
      { align: 'right' }
    );

  // Tags
  if (note.tags && note.tags.length > 0) {
    doc
      .moveDown(0.3)
      .fontSize(10)
      .fillColor('#0ABFBC')
      .text(note.tags.map(t => `#${t}`).join('  '));
  }

  // Divider line
  doc
    .moveDown(0.8)
    .moveTo(60, doc.y)
    .lineTo(doc.page.width - 60, doc.y)
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .stroke();

  doc.moveDown(1);

  // ── Content Section ───────────────────────
  if (note.content) {
    // Convert HTML to structured plain text
    const plainText = convert(note.content, {
      wordwrap: 100,
      selectors: [
        // Headings
        {
          selector: 'h1',
          format: 'block',
          options: { uppercase: false }
        },
        {
          selector: 'h2',
          format: 'block',
          options: { uppercase: false }
        },
        {
          selector: 'h3',
          format: 'block',
          options: { uppercase: false }
        },
        // Lists
        {
          selector: 'ul',
          options: { itemPrefix: '• ' }
        },
        // Code blocks - preserve as-is
        {
          selector: 'pre',
          format: 'block'
        },
        // Remove images (can't embed easily)
        {
          selector: 'img',
          format: 'skip'
        },
      ],
    });

    // Parse and render each section with appropriate styling
    const lines = plainText.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        doc.moveDown(0.4);
        i++;
        continue;
      }

      // Detect heading by checking original HTML
      const isH1 = note.content.includes(`<h1>${line}</h1>`) ||
                   note.content.includes(`<h1 `);
      const isH2 = note.content.includes(`<h2>${line}</h2>`);
      const isH3 = note.content.includes(`<h3>${line}</h3>`);
      const isBullet = line.startsWith('• ');
      const isCode = line.startsWith('    ') || line.startsWith('\t');

      if (isH1) {
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .fillColor('#111827')
          .text(line)
          .moveDown(0.3);
      } else if (isH2) {
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor('#1f2937')
          .text(line)
          .moveDown(0.3);
      } else if (isH3) {
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .fillColor('#374151')
          .text(line)
          .moveDown(0.2);
      } else if (isBullet) {
        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#374151')
          .text(line, { indent: 20 })
          .moveDown(0.15);
      } else if (isCode) {
        doc
          .fontSize(10)
          .font('Courier')
          .fillColor('#1e293b')
          .text(line, {
            indent: 20,
            lineGap: 2,
          })
          .moveDown(0.1);
      } else {
        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#374151')
          .text(line, {
            lineGap: 3,
            align: 'justify',
          })
          .moveDown(0.2);
      }

      i++;
    }
  } else {
    doc
      .fontSize(12)
      .fillColor('#9ca3af')
      .text('This note has no content yet.');
  }

  // ── Footer ────────────────────────────────
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    // Footer line
    doc
      .moveTo(60, doc.page.height - 50)
      .lineTo(doc.page.width - 60, doc.page.height - 50)
      .strokeColor('#e5e7eb')
      .lineWidth(0.5)
      .stroke();

    // Footer text
    doc
      .fontSize(9)
      .fillColor('#9ca3af')
      .text(
        `Exported from VaultDesk • ${new Date().toLocaleDateString()}`,
        60,
        doc.page.height - 38,
        { continued: true }
      )
      .text(
        `Page ${i + 1} of ${pageCount}`,
        { align: 'right' }
      );
  }

  doc.end();
};

module.exports = { generateNotePDF };