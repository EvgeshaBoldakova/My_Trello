import React, { JSX, useState } from 'react';
import api from 'api/request';
import { ICreateBoardProps } from 'common/interfaces/ICreateBoardProps';
import { toast } from 'react-toastify';
import { isValidTitle } from 'utils/validation';

export function CreateBoard({ onCardCreated, onCloseModal }: ICreateBoardProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('grey');

  const clearAndCloseModalWindow = (): void => {
    setTitle('');
    setBackground('grey');
    onCloseModal();
  };

  // Створення дошки
  const createBoard = async (): Promise<void> => {
    if (!isValidTitle(title)) return;

    try {
      await api.post('/board', { title, custom: { background } });
      onCardCreated();
      clearAndCloseModalWindow();
      toast.success('Дошку успішно створено!');
    } catch (error) {
      toast.error('Помилка при створенні дошки');
    }
  };

  return (
    <div className="modalWindow">
      <div className="modalWindow__content">
        <h3 className="modalWindow__title">Створити дошку</h3>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="modalWindow__input"
          type="text"
          placeholder="Введіть назву дошки"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createBoard();
            }
            if (e.key === 'Escape') {
              clearAndCloseModalWindow();
            }
          }}
        />

        <p className="modalWindow__choiceColor">Оберіть колір</p>
        <input
          className="modalWindow__selectColor"
          type="color"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
        <div className="modalWindow__buttonContainer">
          <button className="buttonCreate" onClick={createBoard}>
            Створити
          </button>
          <button className="buttonCLose" onClick={clearAndCloseModalWindow}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
