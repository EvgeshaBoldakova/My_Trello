import React, { JSX, useRef, useState } from 'react';
import './list.scss';
import { toast } from 'react-toastify';
import { ListProps } from 'common/interfaces/IListProps';
import { useParams } from 'react-router-dom';
import { isValidTitle } from 'utils/validation';
import { updateListTitle } from 'services/list.service';
import { createCard, deleteCard, updateCardTitle } from 'services/card.service';
import { Card } from '../Card/Card';

export function List({ id, title, cards, onDeleteList, onCardCreated }: ListProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);
  const { boardId } = useParams<{ boardId: string }>();
  const prevListTitle = useRef('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [cardTitle, setCardTitle] = useState('');

  // Редагування назви списку
  const startEditingListTitle = (): void => {
    prevListTitle.current = listTitle;
    setIsEditing(true);
  };

  const editingListTitle = async (): Promise<void> => {
    if (!isValidTitle(listTitle)) return;
    try {
      await updateListTitle(boardId!, listTitle, id);
      toast.success('Назву списку успішно змінено!');
    } catch (error) {
      toast.error('Помилка при редагуванні назви списку');
    }
    setIsEditing(false);
  };

  // Скасування редагування назви списку при натисканні Escape
  // const stopEditingListTitle = async (): Promise<void> => {
  //   try {
  //     await updateListTitle(boardId, prevListTitle.current, id);
  //     setListTitle(prevListTitle.current);
  //   } catch (error) {
  //     toast.error('Помилка');
  //   }
  //   setIsEditing(false);
  // };

  const stopEditingListTitle = (): void => {
    setListTitle(prevListTitle.current);
    setIsEditing(false);
  };

  const handleClick = (): void => {
    setIsButtonPressed(true);
  };

  const stopAddCard = (): void => {
    setIsButtonPressed(false);
    setCardTitle('');
  };

  // Створення картки
  const handleCreateCard = async (): Promise<void> => {
    if (!isValidTitle(cardTitle)) return;

    try {
      await createCard(boardId!, id, cardTitle, cards.length);
      onCardCreated();
      setCardTitle('');
      setIsButtonPressed(false);
      toast.success('Картку успішно додано!');
    } catch (err) {
      toast.error('Помилка при створенні картки');
    }
  };

  // Видалення картки
  const handleDeleteCard = async (cardId: number): Promise<void> => {
    try {
      await deleteCard(boardId!, cardId);
      onCardCreated();
      toast.success('Картку успішно видалено!');
    } catch (error) {
      toast.error('Помилка при видаленні картки');
    }
  };

  // Редагування назви картки
  const editingCardTitle = async (cardId: number, newCardTitle: string, description: string): Promise<void> => {
    if (!isValidTitle(newCardTitle)) return;
    try {
      await updateCardTitle(boardId!, cardId, id, newCardTitle, description);
      onCardCreated();
      toast.success('Назву картки успішно змінено!');
    } catch (error) {
      toast.error('Помилка при редагуванні назви картки');
    }
  };

  return (
    <div className="list">
      {isEditing && (
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="list__titleEditing"
          type="text"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          onBlur={() => {
            editingListTitle();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editingListTitle();
            }
            if (e.key === 'Escape') {
              stopEditingListTitle();
            }
          }}
        />
      )}
      {!isEditing && (
        <h2 className="list__title" onClick={startEditingListTitle}>
          {listTitle}
        </h2>
      )}

      <div className="list__cards">
        {cards.map((card) => (
          <div className="list__card" key={card.id}>
            <div className="list__cardTitle">
              <Card
                title={card.title}
                onEditCard={(newCardTitle: string, description: string) =>
                  editingCardTitle(card.id, newCardTitle, description)
                }
                description={card.description}
              />
            </div>
            <button className="list__deleteCard" onClick={() => handleDeleteCard(card.id)}>
              ✕
            </button>
          </div>
        ))}

        {isButtonPressed && (
          <div className="list__addCard">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="list__inputCardTitle"
              type="text"
              placeholder="Введіть назву"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCard();
                }
                if (e.key === 'Escape') {
                  stopAddCard();
                }
              }}
            />

            <div className="list__addButtonContainer">
              <button onClick={handleCreateCard} className="list__createButton">
                Створити
              </button>
              <button onClick={stopAddCard} className="list__closeButton">
                ×
              </button>
            </div>
          </div>
        )}
        {!isButtonPressed && (
          <button onClick={handleClick} className="list__addCardButton">
            + Додати картку
          </button>
        )}

        <button onClick={() => onDeleteList(id)} className="list__deleteList">
          Видалити список
        </button>
      </div>
    </div>
  );
}
