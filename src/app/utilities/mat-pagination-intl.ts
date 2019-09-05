import { MatPaginatorIntl } from '@angular/material';

export function getMatPaginatorUkr() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Рядків на сторінці:';
  paginatorIntl.firstPageLabel = 'Перша сторінка';
  paginatorIntl.previousPageLabel = 'Попередня сторінка';
  paginatorIntl.nextPageLabel = 'Наступна сторінка';
  paginatorIntl.lastPageLabel = 'Остання сторінка';
  paginatorIntl.getRangeLabel = (startIndex: number, endIndex: number, length: number) => {
    return `${startIndex + 1} - ${endIndex} із ${length}`;
  }

  return paginatorIntl;
}

