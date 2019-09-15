import { MatPaginatorIntl } from '@angular/material';

export function getMatPaginatorUkr() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Рядків на сторінці:';
  paginatorIntl.firstPageLabel = 'Перша сторінка';
  paginatorIntl.previousPageLabel = 'Попередня сторінка';
  paginatorIntl.nextPageLabel = 'Наступна сторінка';
  paginatorIntl.lastPageLabel = 'Остання сторінка';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    let endPage = (() => {
      if ((pageSize + (page * pageSize)) > length) {
        return length;
      } else return pageSize + (page * pageSize);
    })();
    return `${(page * pageSize) + 1} - ${endPage} із ${length}`;
  }

  return paginatorIntl;
}

