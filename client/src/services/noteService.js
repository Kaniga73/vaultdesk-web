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