export interface Order {
  id: string;
  cell: string;
  items: string[];
  total: number;
  status: 'ready' | 'processing' | 'completed';
  cellNumber: number;
}

// Генерация случайных заказов
export const generateRandomOrder = (): Order => {
  const orderIds = ['WB12345678', 'WB87654321', 'WB55667788', 'WB99112233', 'WB44556677'];
  const cells = [
    { cell: 'А-15', number: 15 },
    { cell: 'Б-23', number: 23 },
    { cell: 'В-07', number: 7 },
    { cell: 'Г-41', number: 41 },
    { cell: 'Д-12', number: 12 }
  ];
  const items = [
    ['Кроссовки Nike', 'Футболка'],
    ['Платье летнее'],
    ['Джинсы', 'Рубашка', 'Кепка'],
    ['Сумка женская'],
    ['Телефон Samsung', 'Чехол']
  ];
  const totals = [2890, 1590, 4250, 3100, 15990];
  
  const randomIndex = Math.floor(Math.random() * orderIds.length);
  const selectedCell = cells[randomIndex];
  
  return {
    id: orderIds[randomIndex],
    cell: selectedCell.cell,
    cellNumber: selectedCell.number,
    items: items[randomIndex],
    total: totals[randomIndex],
    status: 'ready'
  };
};