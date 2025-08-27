import React from 'react';
import Icon from '@/components/ui/icon';

interface FileStatusGridProps {
  uploadStatus: Record<string, 'pending' | 'uploaded'>;
}

const FileStatusGrid = ({ uploadStatus }: FileStatusGridProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Текущий статус</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'discount', label: 'Скидки', icon: 'Percent' },
          { key: 'camera', label: 'Камера', icon: 'Camera' },
          { key: 'rate', label: 'Оценка', icon: 'Star' },
          { key: 'cells_folder', label: 'Ячейки', icon: 'Package' }
        ].map(({ key, label, icon }) => (
          <div key={key} className={`p-3 rounded-lg border text-center ${
            uploadStatus[key] === 'uploaded' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            <Icon name={icon as any} size={20} className="mx-auto mb-1" />
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs">
              {uploadStatus[key] === 'uploaded' ? '✅ Загружено' : '⏳ Нет файла'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileStatusGrid;