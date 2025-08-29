import React, { JSX, useRef, useState } from 'react';
import { ListProps } from 'common/interfaces/IListProps';
import { useParams } from 'react-router-dom';
import { isValidTitle } from 'utils/validation';
import { updateListTitle } from 'services/list.service';
import { createCard, deleteCard, updateCardTitle } from 'services/card.service';
import styles from './list.module.scss';
import { Card } from '../Card/Card';
import { handleRequest } from '../../../../utils/handleRequest';

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
    await handleRequest(
      (): Promise<void> => updateListTitle(boardId!, listTitle, id),
      'Назву списку успішно змінено!',
      'Помилка при редагуванні назви списку'
    );
    setIsEditing(false);
  };

  // Скасування редагування назви списку при натисканні Escape
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
    const result = await handleRequest(
      (): Promise<void> => createCard(boardId!, id, cardTitle, cards.length),
      'Картку успішно додано!',
      'Помилка при створенні картки'
    );
    if (result !== undefined) {
      onCardCreated();
      setCardTitle('');
      setIsButtonPressed(false);
    }
  };

  // Видалення картки
  const handleDeleteCard = async (cardId: number): Promise<void> => {
    const result = await handleRequest(
      (): Promise<void> => deleteCard(boardId!, cardId),
      'Картку успішно видалено!',
      'Помилка при видаленні картки'
    );
    if (result !== undefined) {
      onCardCreated();
    }
  };

  // Редагування назви картки
  const editingCardTitle = async (cardId: number, newCardTitle: string, description: string): Promise<void> => {
    if (!isValidTitle(newCardTitle)) return;
    const result = await handleRequest(
      (): Promise<void> => updateCardTitle(boardId!, cardId, id, newCardTitle, description),
      'Назву картки успішно змінено!',
      'Помилка при редагуванні назви картки'
    );
    if (result !== undefined) {
      onCardCreated();
    }
  };

  return (
    <div className={styles.list}>
      {isEditing && (
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className={styles.list__titleEditing}
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
        <h2 className={styles.list__title} onClick={startEditingListTitle}>
          {listTitle}
        </h2>
      )}

      <div className={styles.list__cards}>
        {cards.map((card) => (
          <div className={styles.list__card} key={card.id}>
            <div className={styles.list__cardTitle}>
              <Card
                title={card.title}
                onEditCard={(newCardTitle: string, description: string) =>
                  editingCardTitle(card.id, newCardTitle, description)
                }
                description={card.description}
              />
            </div>
            <button className={styles.list__deleteCard} onClick={() => handleDeleteCard(card.id)}>
              ✕
            </button>
          </div>
        ))}

        {isButtonPressed && (
          <div className={styles.list__addCard}>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className={styles.list__inputCardTitle}
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

            <div className={styles.list__addButtonContainer}>
              <button onClick={handleCreateCard} className={styles.list__createButton}>
                Створити
              </button>
              <button onClick={stopAddCard} className={styles.list__closeButton}>
                ×
              </button>
            </div>
          </div>
        )}
        {!isButtonPressed && (
          <button onClick={handleClick} className={styles.list__addCardButton}>
            + Додати картку
          </button>
        )}

        <button onClick={() => onDeleteList(id)} className={styles.list__deleteList}>
          Видалити список
        </button>
      </div>
    </div>
  );
}
