import api from 'api/request';

export const createCard = async (boardId: string, listId: number, title: string, position: number): Promise<void> =>
  api.post(`/board/${boardId}/card`, { title, list_id: listId, position });

export const deleteCard = async (boardId: string, cardId: number): Promise<void> =>
  api.delete(`/board/${boardId}/card/${cardId}`);

export const updateCardTitle = async (
  boardId: string,
  cardId: number,
  listId: number,
  title: string,
  description: string
): Promise<void> => api.put(`/board/${boardId}/card/${cardId}`, { title, description, list_id: listId });
