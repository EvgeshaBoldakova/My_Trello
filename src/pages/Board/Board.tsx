import { Link } from 'react-router-dom';
import React, { JSX, useState } from 'react';
import './board.scss';
import { List } from './components/List/List';

export function Board(): JSX.Element {
  const [title] = useState('Моя тестова дошка');
  const [lists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакою' },
      ],
    },
  ]);

  const componentList = lists.map((list) => <List key={list.id} title={list.title} cards={list.cards} />);

  return (
    <div className="board">
      <Link to="/" className="board__home-link">
        ← Додому
      </Link>
      <h1 className="board__title">{title}</h1>
      <div className="board__lists">
        {componentList}
        <button className="board__add-list">+ Додати список</button>
      </div>
    </div>
  );
}
