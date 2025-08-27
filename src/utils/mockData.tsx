// Моковые данные для демонстрации функций приложения

export const generateMockOrder = (phoneNumber?: string) => {
  const mockOrders = [
    {
      id: 'WB' + Math.random().toString().slice(2, 11),
      phoneNumber: phoneNumber || '+7 (9**) ***-**-' + Math.floor(Math.random() * 100),
      customerName: ['Анна Сергеева', 'Михаил Петров', 'Елена Волкова', 'Дмитрий Козлов', 'Светлана Морозова'][Math.floor(Math.random() * 5)],
      items: [
        {
          name: ['Смартфон iPhone 15 Pro', 'Наушники Sony', 'Кроссовки Nike', 'Рюкзак Adidas', 'Часы Apple Watch'][Math.floor(Math.random() * 5)],
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 50000) + 5000,
          barcode: Math.random().toString().slice(2, 15)
        }
      ],
      cellNumber: Math.floor(Math.random() * 50) + 1,
      status: 'ready' as const,
      orderDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 0,
      pickupCode: Math.floor(Math.random() * 9000) + 1000
    }
  ];

  const order = mockOrders[0];
  order.totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return order;
};

export const generateMockProducts = () => {
  return [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Электроника',
      price: 129990,
      barcode: '1234567890123',
      inStock: 5,
      reserved: 2
    },
    {
      id: '2', 
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Электроника',
      price: 119990,
      barcode: '2234567890124',
      inStock: 3,
      reserved: 1
    },
    {
      id: '3',
      name: 'AirPods Pro 2-го поколения',
      category: 'Аксессуары',
      price: 24990,
      barcode: '3234567890125',
      inStock: 12,
      reserved: 5
    },
    {
      id: '4',
      name: 'MacBook Pro 14" M3',
      category: 'Компьютеры',
      price: 199990,
      barcode: '4234567890126',
      inStock: 2,
      reserved: 1
    },
    {
      id: '5',
      name: 'Nike Air Max 270',
      category: 'Обувь',
      price: 12990,
      barcode: '5234567890127',
      inStock: 8,
      reserved: 3
    }
  ];
};

export const generateMockReturns = () => {
  return [
    {
      id: '1',
      orderNumber: 'WB789123456',
      productName: 'Смартфон iPhone 15 Pro',
      customerName: 'Иван Петров',
      customerPhone: '+7 (999) 123-45-67',
      reason: 'Не подошел размер',
      status: 'pending' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('ru-RU'),
      refundAmount: 89990,
      images: [],
      notes: 'Товар в отличном состоянии, упаковка не вскрыта'
    },
    {
      id: '2',
      orderNumber: 'WB789123457', 
      productName: 'Наушники Sony WH-1000XM5',
      customerName: 'Мария Сидорова',
      customerPhone: '+7 (999) 234-56-78',
      reason: 'Брак товара - не работает левый наушник',
      status: 'approved' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('ru-RU'),
      refundAmount: 24990,
      images: ['defect1.jpg'],
      notes: 'Подтверждён заводской брак'
    }
  ];
};

export const mockCellNumbers = Array.from({length: 50}, (_, i) => i + 1);

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  // Простое форматирование номера телефона
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  } else if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }
  return phone;
};

export const generateRandomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};