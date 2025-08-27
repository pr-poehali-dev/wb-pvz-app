import React from 'react';
import Icon from '@/components/ui/icon';

interface UnrecognizedFilesListProps {
  unrecognizedFiles: File[];
}

const UnrecognizedFilesList = ({ unrecognizedFiles }: UnrecognizedFilesListProps) => {
  if (unrecognizedFiles.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
        Не распознанные файлы ({unrecognizedFiles.length})
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {unrecognizedFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <Icon name="Music" className="text-yellow-600" size={16} />
            <span className="flex-1">{file.name}</span>
            <span className="text-xs text-yellow-600">Переименуйте файл</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-yellow-700 mt-2">
        💡 Переименуйте файлы согласно примерам выше и загрузите снова
      </p>
    </div>
  );
};

export default UnrecognizedFilesList;