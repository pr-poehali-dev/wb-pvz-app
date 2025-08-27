import React from 'react';
import Icon from '@/components/ui/icon';

const UploadInstructions = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Icon name="Lightbulb" size={16} className="text-blue-600" />
        Автоматическое распознавание файлов
      </h3>
      <div className="text-sm text-gray-700 space-y-2">
        <p>🎯 <strong>Загрузите всю папку сразу</strong> - система автоматически распознает каждый файл по названию!</p>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="font-medium">Примеры названий:</p>
            <ul className="text-xs space-y-1 mt-1">
              <li>• <code>discount.mp3</code> → Скидки</li>
              <li>• <code>camera.mp3</code> → Проверка под камерой</li>
              <li>• <code>1.mp3, 2.mp3...</code> → Ячейки</li>
              <li>• <code>ячейка15.mp3</code> → Ячейка 15</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Ключевые слова:</p>
            <ul className="text-xs space-y-1 mt-1">
              <li>• скидка, кошелёк, товары</li>
              <li>• камера, проверьте, товар</li>
              <li>• оцените, приложение, выдача</li>
              <li>• любые цифры (для ячеек)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInstructions;