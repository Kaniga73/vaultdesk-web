import api from './api'

export const getTopics = async (workspaceId) => {
  const { data } = await api.get(`/workspaces/${workspaceId}/topics`)
  return data
}

export const createTopic = async (workspaceId, topicData) => {
  const { data } = await api.post(`/workspaces/${workspaceId}/topics`, topicData)
  return data
}

export const updateTopic = async (id, topicData) => {
  const { data } = await api.put(`/topics/${id}`, topicData)
  return data
}

export const deleteTopic = async (id) => {
  const { data } = await api.delete(`/topics/${id}`)
  return data
}