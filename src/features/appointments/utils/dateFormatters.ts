
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDay = (date: Date) => {
  return format(date, 'd', { locale: ptBR });
};

export const formatWeekday = (date: Date) => {
  return format(date, 'EEEE', { locale: ptBR });
};

export const formatMonth = (date: Date) => {
  return format(date, 'MMMM yyyy', { locale: ptBR });
};
