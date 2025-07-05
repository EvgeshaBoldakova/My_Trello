import React, { JSX } from 'react';
import './card.scss';

interface CardProps {
  id: number;
  title: string;
}
export function Card({ title }: CardProps): JSX.Element {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
    </div>
  );
}
