import api from './api'

export const getNotes = async (topicId) => {
  const { data } = await api.get(`/topics/${topicId}/notes`)
  return data
}

export const getNote = async (id) => {
  const { data } = await api.get(`/notes/${id}`)
  return data
}

export const createNote = async (topicId, noteData) => {
  const { data } = await api.post(`/topics/${topicId}/notes`, noteData)
  return data
}

export const updateNote = async (id, noteData) => {
  const { data } = await api.put(`/notes/${id}`, noteData)
  return data
}

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`)
  return data
}
export const searchNotes = async (query) => {
  const { data } = await api.get(`/notes/search?q=${encodeURIComponent(query)}`)
  return data
}
export const exportNotePDF = async (id, title) => {
  const response = await api.get(`/notes/${id}/export/pdf`, {
    responseType: 'blob',
  })

  const contentType = response.headers['content-type'] || 'application/pdf'
  const contentDisposition = response.headers['content-disposition'] || ''
  const defaultFileName = `${(title || 'note').replace(/[^a-z0-9._-]+/gi, '_')}.pdf`
  const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)(?:"|$)/i)
  const fileName = fileNameMatch ? decodeURIComponent(fileNameMatch[1]) : defaultFileName

  const blob = new Blob([response.data], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1500)
}