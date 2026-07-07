import api from './api'

export const getWorkspaces = async () => {
  const { data } = await api.get('/workspaces')
  return data
}

export const createWorkspace = async (workspaceData) => {
  const { data } = await api.post('/workspaces', workspaceData)
  return data
}

export const getWorkspace = async (id) => {
  const { data } = await api.get(`/workspaces/${id}`)
  return data
}

export const updateWorkspace = async (id, workspaceData) => {
  const { data } = await api.put(`/workspaces/${id}`, workspaceData)
  return data
}

export const deleteWorkspace = async (id) => {
  const { data } = await api.delete(`/workspaces/${id}`)
  return data
}