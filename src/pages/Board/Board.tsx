import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { JSX, useEffect, useRef, useState } from 'react';
import './board.scss';
import { toast } from 'react-toastify';
import api from 'api/request';
import { IBoard } from 'common/interfaces/IBoard';
import { IList } from 'common/interfaces/IList';
import { isValidTitle } from 'utils/validation';
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
    const getBoard = async (): Promise<void> => {
      try {
        const response: IBoard = await api.get(`/board/${boardId}`);
        setTitle(response.title);
        setBackground(response.custom.background);
      } catch (error) {
        toast.error('Помилка при отриманні даних дошки');
      }
    };
    getBoard();
  }, [boardId]);

  // Видалення дошки та повернення на головну сторінку
  const deleteBoard = async (): Promise<void> => {
    try {
      await api.delete(`/board/${boardId}`);
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
      await api.put(`/board/${boardId}`, { title });
      const response: IBoard = await api.get(`/board/${boardId}`);
      setTitle(response.title);
      toast.success('Назву дошки успішно змінено!');
    } catch (error) {
      toast.error('Помилка при редагуванні назви дошки');
    }
    setIsEditing(false);
  };

  // Скасування редагування назви дошки при натисканні Escape
  const stopTitleEditing = async (): Promise<void> => {
    try {
      await api.put(`/board/${boardId}`, { title: prevTitle.current });
      await api.get(`/board/${boardId}`);
      setTitle(prevTitle.current);
    } catch (error) {
      toast.error('Помилка');
    }
    setIsEditing(false);
  };

  // Отримання даних про списки
  const getLists = async (): Promise<void> => {
    try {
      const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
      setLists(data.lists);
    } catch (error) {
      toast.error('Помилка при отриманні даних про списки');
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  const handleClick = (): void => {
    setIsButtonPressed(true);
  };

  const stopCreateList = (): void => {
    setListTitle('');
    setIsButtonPressed(false);
  };

  // Створення списку
  const createList = async (): Promise<void> => {
    if (!isValidTitle(listTitle)) return;

    try {
      await api.post(`/board/${boardId}/list`, {
        boardId,
        title: listTitle,
        position: lists.length,
      });
      getLists();
      setListTitle('');
      setIsButtonPressed(false);
      toast.success('Список успішно створено!');
    } catch (err) {
      toast.error('Помилка при створенні списку');
    }
  };

  // Видалення списку
  const deleteList = async (id: number): Promise<void> => {
    try {
      await api.delete(`/board/${boardId}/list/${id}`);
      toast.success('Список успішно видалено!');
      getLists();
    } catch (error) {
      toast.error('Помилка при видаленні списку');
    }
  };

  // Зміна кольору фону дошки
  const changeBackground = async (newBackground: string): Promise<void> => {
    try {
      setBackground(newBackground);
      await api.put(`/board/${boardId}`, { custom: { background: newBackground } });
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
        await api.put(`/board/${boardId}`, { custom: { background: newBackground } });
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

        <button onClick={deleteBoard} className="board__deleteBoard">
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
              onDeleteList={deleteList}
              onCardCreated={getLists}
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
                    createList();
                  }
                  if (e.key === 'Escape') {
                    stopCreateList();
                  }
                }}
              />
              <div className="board__addButtonContainer">
                <button onClick={createList} className="board__createButton">
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
