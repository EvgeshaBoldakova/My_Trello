import React, { JSX, useState } from 'react';
import { ICreateBoardProps } from 'common/interfaces/ICreateBoardProps';
import { isValidTitle } from 'utils/validation';
import { createBoard } from 'services/board.service';
import { handleRequest } from 'utils/handleRequest';
import { IBoard } from 'common/interfaces/IBoard';

export function CreateBoard({ onCardCreated, onCloseModal }: ICreateBoardProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('grey');

  const clearAndCloseModalWindow = (): void => {
    setTitle('');
    setBackground('grey');
    onCloseModal();
  };

  const handleCreateBoard = async (): Promise<void> => {
    if (!isValidTitle(title)) return;
    const result = await handleRequest(
      (): Promise<IBoard> => createBoard(title, background),
      'Дошку успішно створено!',
      'Помилка при створенні дошки'
    );
    if (result !== undefined) {
      await onCardCreated();
      clearAndCloseModalWindow();
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
              handleCreateBoard();
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
          <button className="buttonCreate" onClick={handleCreateBoard}>
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
