import { TITLE_REGEX } from 'common/constants/regex';
import { toast } from 'react-toastify';

export function isValidTitle(title: string): boolean {
  if (title.trim() === '' || !TITLE_REGEX.test(title)) {
    toast.error('Рядок порожній, або назва містить недопустимі символи');
    toast.info('Можна використовувати цифри, літери (а, А), пробіли, тире, крапки, нижні підкреслення');
    return false;
  }
  return true;
}
