import './board.scss';
import { JSX } from 'react';

export interface BoardProps {
  title: string;
  background: string;
}

export function Board({ title, background }: BoardProps): JSX.Element {
  return (
    <div className="square" style={{ background }}>
      <h2 className="title">{title}</h2>
    </div>
  );
}
