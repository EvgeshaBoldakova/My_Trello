import React, { JSX, useRef, useState } from 'react';
import { CardProps } from 'common/interfaces/ICardProps';
import { isValidTitle } from 'utils/validation';
import styles from './card.module.scss';

export function Card({ title, description, onEditCard }: CardProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const prevCardTitle = useRef('');

  // Редагування назви картки
  const startEditingCardTitle = (): void => {
    prevCardTitle.current = cardTitle;
    setIsEditing(true);
  };

  const editingCardTitle = (): void => {
    if (!isValidTitle(cardTitle)) return;
    onEditCard(cardTitle, description);
    setIsEditing(false);
  };

  const stopEditingCardTitle = (): void => {
    setCardTitle(prevCardTitle.current);
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      {isEditing && (
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className={styles.card__titleEditing}
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          onBlur={editingCardTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editingCardTitle();
            }
            if (e.key === 'Escape') {
              stopEditingCardTitle();
            }
          }}
        />
      )}
      {!isEditing && (
        <div className={styles.card_title} onClick={startEditingCardTitle}>
          {title}
        </div>
      )}
    </div>
  );
}
