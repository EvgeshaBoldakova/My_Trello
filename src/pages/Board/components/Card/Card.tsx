import React, { JSX } from 'react';

interface CardProps {
  title: string;
}

export function Card({ title }: CardProps): JSX.Element {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
    </div>
  );
}
