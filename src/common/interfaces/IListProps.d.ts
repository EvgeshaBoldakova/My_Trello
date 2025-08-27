import { IList } from './IList';

export interface ListProps extends IList {
  onDeleteList: (id: number) => void;
  onCardCreated: () => void;
}
