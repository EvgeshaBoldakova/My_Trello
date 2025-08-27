import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { JSX, useEffect, useRef, useState } from 'react';
import './board.scss';
import { toast } from 'react-toastify';
import { IList } from 'common/interfaces/IList';
import { isValidTitle } from 'utils/validation';
import { deleteBoard, getBoard, updateBoardBackground, updateBoardTitle } from 'services/board.service';
import { createList, deleteList, getLists } from 'services/list.service';
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
      try {
        const response = await getBoard(boardId);
        setTitle(response.title);
        setBackground(response.custom.background);
      } catch (error) {
        toast.error('Помилка при отриманні даних дошки');
      }
    };
    fetchBoard();
  }, [boardId]);

  // Видалення дошки та повернення на головну сторінку
  const handleDeleteBoard = async (): Promise<void> => {
    try {
      await deleteBoard(boardId);
      navigate('/');
      toast.success('Дошку успішно видалено!');
    } catch (error) {
      toast.error('Помилка при видаленні дошки');
    }
  };

  // Редагування назви дошки
  const startTitleEditing = (): void => {
    prevTitle.current = title;
    setIsEditing(true);
  };

  const titleEditing = async (): Promise<void> => {
    if (!isValidTitle(title)) return;
    try {
      await updateBoardTitle(boardId, title);
      const response = await getBoard(boardId);
      setTitle(response.title);
      toast.success('Назву дошки успішно змінено!');
    } catch (error) {
      toast.error('Помилка при редагуванні назви дошки');
    }
    setIsEditing(false);
  };

  // Скасування редагування назви дошки при натисканні Escape
  const stopTitleEditing = (): void => {
    setTitle(prevTitle.current);
    setIsEditing(false);
  };

  const fetchLists = async (): Promise<void> => {
    try {
      const data = await getLists(boardId!);
      setLists(data);
    } catch (error) {
      toast.error('Помилка при отриманні даних про списки');
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

    try {
      await createList(boardId!, listTitle, lists.length);
      await fetchLists();
      setListTitle('');
      setIsButtonPressed(false);
      toast.success('Список успішно створено!');
    } catch (err) {
      toast.error('Помилка при створенні списку');
    }
  };

  // Видалення списку
  const handleDeleteList = async (id: number): Promise<void> => {
    if (!boardId) return;
    try {
      await deleteList(boardId, id);
      await fetchLists();
      toast.success('Список успішно видалено!');
    } catch (error) {
      toast.error('Помилка при видаленні списку');
    }
  };

  // Зміна кольору фону дошки
  const changeBackground = async (newBackground: string): Promise<void> => {
    try {
      setBackground(newBackground);
      await updateBoardBackground(boardId, newBackground);
      toast.success('Фон дошки успішно змінено!');
    } catch (error) {
      toast.error('Помилка при зміні фону дошки');
    }
  };

  // Вибір фото для фону дошки
  const chooseBackground = (file: File): void => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (): Promise<void> => {
      const newBackground = reader.result as string;
      setBackground(newBackground);
      try {
        await updateBoardBackground(boardId, newBackground);
        toast.success('Фон дошки успішно змінено!');
      } catch (error) {
        toast.error('Помилка при зміні фону дошки');
      }
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

      <div
        className="board__container"
        style={
          background.startsWith('data:image')
            ? {
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : { backgroundColor: background }
        }
      >
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
