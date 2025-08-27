import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Dashboard = () => {
  // Моковые данные статистики
  const stats = {
    todayOrders: 47,
    todayReturns: 5,
    todayReception: 23,
    activeCells: 38,
    totalCells: 50,
    avgDeliveryTime: '12 мин',
    successRate: 98.5
  };

  const recentActivity = [
    { id: 1, type: 'order', message: 'Заказ WB123456789 выдан клиенту', time: '2 мин назад', icon: 'Package' },
    { id: 2, type: 'return', message: 'Возврат по заказу WB987654321 одобрен', time: '5 мин назад', icon: 'RotateCcw' },
    { id: 3, type: 'reception', message: 'Принято 15 товаров в ячейки 23-37', time: '8 мин назад', icon: 'PackageCheck' },
    { id: 4, type: 'order', message: 'Заказ WB555444333 готов к выдаче', time: '12 мин назад', icon: 'Bell' },
    { id: 5, type: 'system', message: 'Обновлены аудиофайлы системы', time: '25 мин назад', icon: 'Settings' }
  ];

  const topCells = [
    { number: 15, orders: 8, percentage: 16 },
    { number: 23, orders: 7, percentage: 14 },
    { number: 7, orders: 6, percentage: 12 },
    { number: 31, orders: 5, percentage: 10 },
    { number: 12, orders: 5, percentage: 10 }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600';
      case 'return': return 'text-orange-600';
      case 'reception': return 'text-green-600';
      case 'system': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <Icon name="BarChart3" size={48} className="text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Дашборд ПВЗ</h2>
        <p className="text-gray-600">Общая статистика и активность за сегодня</p>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="Package" size={24} className="text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.todayOrders}</div>
            <div className="text-sm text-gray-600">Выдач сегодня</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="RotateCcw" size={24} className="text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{stats.todayReturns}</div>
            <div className="text-sm text-gray-600">Возвратов сегодня</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="PackageCheck" size={24} className="text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.todayReception}</div>
            <div className="text-sm text-gray-600">Приёмок сегодня</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="Grid3x3" size={24} className="text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.activeCells}/{stats.totalCells}</div>
            <div className="text-sm text-gray-600">Активных ячеек</div>
          </CardContent>
        </Card>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последняя активность */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Activity" size={20} />
              Последняя активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <Icon 
                    name={activity.icon as any} 
                    size={16} 
                    className={`mt-1 ${getActivityColor(activity.type)}`} 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Топ ячеек */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Самые популярные ячейки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCells.map((cell, index) => (
                <div key={cell.number} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Ячейка {cell.number}</span>
                      <Badge variant="secondary">{cell.orders} заказов</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${cell.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="Clock" size={20} className="text-gray-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">{stats.avgDeliveryTime}</div>
            <div className="text-sm text-gray-600">Среднее время выдачи</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="CheckCircle" size={20} className="text-green-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-green-600">{stats.successRate}%</div>
            <div className="text-sm text-gray-600">Успешных выдач</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Icon name="Users" size={20} className="text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-blue-600">324</div>
            <div className="text-sm text-gray-600">Клиентов за неделю</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;