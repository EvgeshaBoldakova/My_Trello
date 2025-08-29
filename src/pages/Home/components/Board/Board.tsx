import { JSX } from 'react';
import { BoardProps } from 'common/interfaces/IBoardProps';
import { getBackgroundStyle } from 'utils/backgroundStyle';
import styles from './board.module.scss';

export function Board({ title, background }: BoardProps): JSX.Element {
  return (
    <div className={styles.square} style={getBackgroundStyle(background)}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
