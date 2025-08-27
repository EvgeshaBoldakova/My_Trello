export interface ICreateBoardProps {
  onCloseModal: () => void;
  onCardCreated: () => Promise<void>;
}
