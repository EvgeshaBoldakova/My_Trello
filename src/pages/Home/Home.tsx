import React, { JSX, useEffect, useState } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import { IBoard } from 'common/interfaces/IBoard';
import { getBoards } from 'services/board.service';
import { Board } from './components/Board/Board';
import { CreateBoard } from './components/CreateBoard/CreateBoard';
import { handleRequest } from '../../utils/handleRequest';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);

  const handleClick = (): void => {
    setIsModalWindowOpen(true);
  };

  const fetchBoards = async (): Promise<void> => {
    const result = await handleRequest(
      (): Promise<IBoard[]> => getBoards(),
      undefined,
      'Помилка при отриманні даних дошки'
    );
    if (result) {
      setBoards(result);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const closeModalWindow = (): void => {
    setIsModalWindowOpen(false);
  };

  return (
    <div className="home">
      <h2 className="home__title">Мої дошки</h2>
      <div className="home__boards">
        {boards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`} className="home__boardLink">
            <Board title={board.title} background={board.custom.background} />
          </Link>
        ))}
        <button onClick={handleClick} className="home__addBoard">
          + Створити дошку
        </button>
        {isModalWindowOpen && <CreateBoard onCardCreated={fetchBoards} onCloseModal={closeModalWindow} />}
      </div>
    </div>
  );
}
