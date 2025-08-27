import React from 'react';
import Icon from '@/components/ui/icon';

const UploadInstructions = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Icon name="Headphones" size={16} className="text-blue-600" />
        Прослушивание и привязка аудиофайлов
      </h3>
      <div className="text-sm text-gray-700 space-y-2">
        <p>🎧 <strong>Загрузите аудиофайлы</strong> - система предложит прослушать каждый и выбрать функцию!</p>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="font-medium">Доступные функции:</p>
            <ul className="text-xs space-y-1 mt-1">
              <li>• <strong>Скидки/Кошелёк</strong> - уведомления о скидках</li>
              <li>• <strong>Камера</strong> - проверка товара под камерой</li>
              <li>• <strong>Оценка</strong> - просьба оценить приложение</li>
              <li>• <strong>Ячейки</strong> - озвучка номеров ячеек (1-999)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Как это работает:</p>
            <ul className="text-xs space-y-1 mt-1">
              <li>• Прослушайте аудиофайл</li>
              <li>• Выберите подходящую функцию</li>
              <li>• Для ячеек укажите номер</li>
              <li>• Переходите к следующему файлу</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInstructions;