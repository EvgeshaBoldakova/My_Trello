import React, { JSX } from 'react';
import './list.scss';
import { ICard } from '../../../../common/interfaces/ICard';

interface ListProps {
  title: string;
  cards: ICard[];
}

export function List({ title, cards }: ListProps): JSX.Element {
  return (
    <div className="list">
      <h2 className="list__title">{title}</h2>
      <div className="list__cards">
        {cards.map((card) => (
          <p className="list__card" key={card.id}>
            <div className="list__card-circle"></div>
            <div className="list__card-title"> {card.title}</div>
          </p>
        ))}
        <button className="list__add-card">+ Додати картку</button>
      </div>
    </div>
  );
}
