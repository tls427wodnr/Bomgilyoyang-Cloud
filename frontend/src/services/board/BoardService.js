import api from '../../api/axios';

//Board API
export const BoardAPI = {
  getAll:       (page = 0)          => api.get(`/api/boards`, { params: { page } }),
  getByViews:   (page = 0)          => api.get(`/api/boards/sort/cnt`, { params: { page } }),
  getByReplies: (page = 0)          => api.get(`/api/boards/sort/replies`, { params: { page } }),
  search:       (keyword, page = 0) => api.get(`/api/boards/search`, { params: { keyword, page } }),
  getOne:       (boardId)           => api.get(`/api/boards/${boardId}`),
  create:       (formData)          => api.post(`/api/boards/inserts`, formData, {
                                         headers: { 'Content-Type': 'multipart/form-data' },
                                       }),
  update:       (boardId, formData) => api.put(`/api/boards/${boardId}`, formData, {
                                         headers: { 'Content-Type': 'multipart/form-data' },
                                       }),
  delete:       (boardId)           => api.delete(`/api/boards/${boardId}`),
  toggleLike:   (boardId)           => api.post(`/api/boards/${boardId}/likes`),
  deleteFile:   (fileId)            => api.delete(`/api/boards/files/${fileId}`),
};

//Reply API
export const ReplyAPI = {
  getAll: (boardId, page = 0) =>
    api.get(`/api/boards/${boardId}/replies`, { params: { page } }),

  create: (boardId, content) =>
    api.post(`/api/boards/${boardId}/replies`, { content }),

  update: (boardId, replyId, content) =>
    api.put(`/api/boards/${boardId}/replies/${replyId}`, { content }),

  delete: (boardId, replyId) =>
    api.delete(`/api/boards/${boardId}/replies/${replyId}`),
};