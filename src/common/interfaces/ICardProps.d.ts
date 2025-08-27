export interface CardProps {
  title: string;
  description: string;
  onEditCard: (newCardTitle: string, description: string) => void;
}
