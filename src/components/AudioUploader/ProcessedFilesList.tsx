import React from 'react';
import Icon from '@/components/ui/icon';

interface ProcessedFile {
  file: File;
  mapping: {
    type: 'discount' | 'camera' | 'rate' | 'cell';
    cellNumber?: number;
  };
  status: 'pending' | 'uploaded' | 'failed';
  displayName: string;
}

interface ProcessedFilesListProps {
  processedFiles: ProcessedFile[];
}

const ProcessedFilesList = ({ processedFiles }: ProcessedFilesListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <Icon name="CheckCircle" className="text-green-500" size={16} />;
      case 'failed': return <Icon name="XCircle" className="text-red-500" size={16} />;
      default: return <Icon name="Clock" className="text-yellow-500" size={16} />;
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Icon name="Percent" className="text-purple-500" size={16} />;
      case 'camera': return <Icon name="Camera" className="text-blue-500" size={16} />;
      case 'rate': return <Icon name="Star" className="text-yellow-500" size={16} />;
      case 'cell': return <Icon name="Package" className="text-green-500" size={16} />;
      default: return <Icon name="Music" className="text-gray-500" size={16} />;
    }
  };

  if (processedFiles.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Icon name="CheckCircle2" size={16} className="text-green-600" />
        Распознанные файлы ({processedFiles.length})
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {processedFiles.map((pf, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            {getFileTypeIcon(pf.mapping.type)}
            <div className="flex-1">
              <div className="font-medium text-sm">{pf.displayName}</div>
              <div className="text-xs text-gray-500">{pf.file.name}</div>
            </div>
            {getStatusIcon(pf.status)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessedFilesList;