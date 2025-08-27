import api from 'api/request';
import { IList } from 'common/interfaces/IList';

export const getLists = async (boardId: string): Promise<IList[]> => {
  const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
  return data.lists;
};

export const createList = async (boardId: string, title: string, position: number): Promise<void> =>
  api.post(`/board/${boardId}/list`, { title, position });

export const deleteList = async (boardId: string, listId: number): Promise<void> =>
  api.delete(`/board/${boardId}/list/${listId}`);

export const updateListTitle = async (boardId: string, title: string, listId: number): Promise<void> =>
  api.put(`/board/${boardId}/list/${listId}`, { title });
