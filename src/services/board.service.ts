import api from 'api/request';
import { IBoard } from 'common/interfaces/IBoard';

export const getBoards = async (): Promise<IBoard[]> => {
  const data: { boards: IBoard[] } = await api.get('/board');
  return data.boards;
};

export const createBoard = async (title: string, background: string): Promise<IBoard> =>
  api.post('/board', { title, custom: { background } });

export const getBoard = async (boardId: string): Promise<IBoard> => api.get(`/board/${boardId}`);

export const deleteBoard = async (boardId: string): Promise<void> => api.delete(`/board/${boardId}`);

export const updateBoardTitle = async (boardId: string, title: string): Promise<IBoard> =>
  api.put(`/board/${boardId}`, { title });

export const updateBoardBackground = async (boardId: string, newBackground: string): Promise<void> => {
  await api.put(`/board/${boardId}`, { custom: { background: newBackground } });
};
