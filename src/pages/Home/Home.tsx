import React, { JSX, useState } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/Board';

export function Home(): JSX.Element {
  const [boards] = useState([
    { id: 1, title: 'Покупки', custom: { background: 'red' } },
    { id: 2, title: 'Підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'Розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'Курс по просуванню у соцмережах', custom: { background: 'pink' } },
    { id: 5, title: 'Задачі на дачі', custom: { background: 'purple' } },
    { id: 6, title: 'Ідеї для подарунків батькам', custom: { background: 'yellow' } },
  ]);

  const componentHome = boards.map((board) => (
    <Board key={board.id} title={board.title} background={board.custom.background} />
  ));

  return (
    <div className="home">
      <h2 className="home__title">Мої дошки</h2>
      <div className="home__boards">
        {componentHome}
        <Link to="/board" className="home__board-link">
          Моя тестова дошка
        </Link>
        <button className="home__add-board">+ Створити дошку</button>
      </div>
    </div>
  );
}
