import React, { JSX } from 'react';
import './list.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';

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
          <div className="list__card" key={card.id}>
            <div className="list__card-circle"></div>
            <Card key={card.id} title={card.title} />
          </div>
        ))}
        <button className="list__add-card">+ Додати картку</button>
      </div>
    </div>
  );
}
