import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { JSX, useEffect, useRef, useState } from 'react';
import './board.scss';
import { IList } from 'common/interfaces/IList';
import { isValidTitle } from 'utils/validation';
import { deleteBoard, getBoard, updateBoardBackground, updateBoardTitle } from 'services/board.service';
import { createList, deleteList, getLists } from 'services/list.service';
import { handleRequest } from 'utils/handleRequest';
import { IBoard } from 'common/interfaces/IBoard';
import { getBackgroundStyle } from 'utils/backgroundStyle';
import { List } from './components/List/List';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('grey');
  const [isEditing, setIsEditing] = useState(false);
  const [lists, setLists] = useState<IList[]>([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [listTitle, setListTitle] = useState('');

  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const prevTitle = useRef('');

  useEffect(() => {
    const fetchBoard = async (): Promise<void> => {
      const result = await handleRequest(
        (): Promise<IBoard> => getBoard(boardId!),
        undefined,
        'Помилка при отриманні даних дошки'
      );
      if (result) {
        setTitle(result.title);
        setBackground(result.custom.background);
      }
    };
    fetchBoard();
  }, [boardId]);

  // Видалення дошки та повернення на головну сторінку
  const handleDeleteBoard = async (): Promise<void> => {
    await handleRequest(
      (): Promise<void> => deleteBoard(boardId!),
      'Дошку успішно видалено!',
      'Помилка при видаленні дошки'
    );
    navigate('/');
  };

  // Редагування назви дошки
  const startTitleEditing = (): void => {
    prevTitle.current = title;
    setIsEditing(true);
  };

  const titleEditing = async (): Promise<void> => {
    if (!isValidTitle(title)) return;
    const result = await handleRequest(
      (): Promise<IBoard> => updateBoardTitle(boardId!, title),
      'Назву дошки успішно змінено!',
      'Помилка при редагуванні назви дошки'
    );
    if (result) {
      const response = await getBoard(boardId!);
      setTitle(response.title);
    }
    setIsEditing(false);
  };

  // Скасування редагування назви дошки при натисканні Escape
  const stopTitleEditing = (): void => {
    setTitle(prevTitle.current);
    setIsEditing(false);
  };

  const fetchLists = async (): Promise<void> => {
    const result = await handleRequest(
      (): Promise<IList[]> => getLists(boardId!),
      undefined,
      'Помилка при отриманні даних про списки'
    );
    if (result) {
      setLists(result);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleClick = (): void => {
    setIsButtonPressed(true);
  };

  const stopCreateList = (): void => {
    setListTitle('');
    setIsButtonPressed(false);
  };

  // Створення списку
  const handleCreateList = async (): Promise<void> => {
    if (!isValidTitle(listTitle)) return;
    const result = await handleRequest(
      (): Promise<void> => createList(boardId!, listTitle, lists.length),
      'Список успішно створено!',
      'Помилка при створенні списку'
    );
    if (result !== undefined) {
      await fetchLists();
      setListTitle('');
      setIsButtonPressed(false);
    }
  };

  // Видалення списку
  const handleDeleteList = async (id: number): Promise<void> => {
    if (!boardId) return;
    await handleRequest(
      (): Promise<void> => deleteList(boardId, id),
      'Список успішно видалено!',
      'Помилка при видаленні списку'
    );
    await fetchLists();
  };

  // Зміна кольору фону дошки
  const changeBackground = async (newBackground: string): Promise<void> => {
    setBackground(newBackground);
    await handleRequest(
      (): Promise<void> => updateBoardBackground(boardId!, newBackground),
      'Фон дошки успішно змінено!',
      'Помилка при зміні фону дошки'
    );
  };

  // Вибір фото для фону дошки
  const chooseBackground = (file: File): void => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (): Promise<void> => {
      const newBackground = reader.result as string;
      setBackground(newBackground);
      await handleRequest(
        (): Promise<void> => updateBoardBackground(boardId!, newBackground),
        'Фон дошки успішно змінено!',
        'Помилка при зміні фону дошки'
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="board">
      <div className="board__header">
        <Link to="/" className="board__homeLink">
          ← Додому
        </Link>
        <div className="board__changeBackground">
          <div className="board__changeColor">
            <p>Змінити колір фону</p>
            <input
              className="board__selectColor"
              type="color"
              value={background}
              onChange={(e) => changeBackground(e.target.value)}
            />
          </div>
          <div className="board__chooseFoto">
            <p>Обрати фото для фону</p>
            <input
              id="background-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  chooseBackground(e.target.files?.[0]);
                }
              }}
            />
            <label htmlFor="background-upload" className="board__selectFoto">
              Обрати фото
            </label>
          </div>
        </div>

        <button onClick={handleDeleteBoard} className="board__deleteBoard">
          Видалити дошку
        </button>
      </div>

      <div className="board__container" style={getBackgroundStyle(background)}>
        <div className="board__titleContainer">
          {isEditing && (
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="board__titleEditing"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                titleEditing();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  titleEditing();
                }
                if (e.key === 'Escape') {
                  stopTitleEditing();
                }
              }}
            />
          )}
          {!isEditing && (
            <h1 className="board__title" onClick={startTitleEditing}>
              {title}
            </h1>
          )}

          <div className="board__ID">
            <h2>Дошка № {boardId}</h2>
          </div>
        </div>
        <div className="board__lists">
          {lists.map((list) => (
            <List
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
              onDeleteList={handleDeleteList}
              onCardCreated={fetchLists}
            />
          ))}
          {isButtonPressed && (
            <div className="board__addList">
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className="board__inputListTitle"
                type="text"
                placeholder="Введіть назву списку"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateList();
                  }
                  if (e.key === 'Escape') {
                    stopCreateList();
                  }
                }}
              />
              <div className="board__addButtonContainer">
                <button onClick={handleCreateList} className="board__createButton">
                  Створити
                </button>
                <button onClick={stopCreateList} className="board__closeButton">
                  ×
                </button>
              </div>
            </div>
          )}
          {!isButtonPressed && (
            <button onClick={handleClick} className="board__addListTitle">
              + Додати список
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
