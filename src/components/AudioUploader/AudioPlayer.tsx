import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AudioPlayerProps {
  file: File;
  onAssign: (functionType: string, cellNumber?: number) => void;
  onSkip: () => void;
}

const FUNCTION_TYPES = [
  { key: 'discount', label: 'Скидки/Кошелёк', icon: 'Percent', color: 'bg-purple-500' },
  { key: 'camera', label: 'Проверка под камерой', icon: 'Camera', color: 'bg-blue-500' },
  { key: 'rate', label: 'Оценка приложения', icon: 'Star', color: 'bg-yellow-500' },
  { key: 'cell', label: 'Ячейка (указать номер)', icon: 'Package', color: 'bg-green-500' }
];

const AudioPlayer = ({ file, onAssign, onSkip }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cellNumber, setCellNumber] = useState<string>('');
  const [selectedFunction, setSelectedFunction] = useState<string>('');

  React.useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = URL.createObjectURL(file);
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        URL.revokeObjectURL(audio.src);
      };
    }
  }, [file]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAssign = (functionType: string) => {
    if (functionType === 'cell') {
      const cellNum = parseInt(cellNumber);
      if (cellNum && cellNum >= 1 && cellNum <= 999) {
        onAssign(functionType, cellNum);
      } else {
        alert('Введите номер ячейки от 1 до 999');
        return;
      }
    } else {
      onAssign(functionType);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Прослушайте аудио и выберите функцию</h3>
          <p className="text-sm text-gray-600">{file.name}</p>
        </div>

        {/* Аудиоплеер */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={togglePlay}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
            </Button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          <audio ref={audioRef} />
        </div>

        {/* Выбор функции */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">К какой функции относится это аудио?</h4>
          <div className="grid grid-cols-2 gap-3">
            {FUNCTION_TYPES.map((type) => (
              <div key={type.key}>
                <Button
                  variant={selectedFunction === type.key ? "default" : "outline"}
                  className={`w-full h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedFunction === type.key ? type.color + ' text-white' : ''
                  }`}
                  onClick={() => setSelectedFunction(type.key)}
                >
                  <Icon name={type.icon as any} size={24} />
                  <span className="text-sm text-center">{type.label}</span>
                </Button>
                
                {/* Поле для номера ячейки */}
                {type.key === 'cell' && selectedFunction === 'cell' && (
                  <input
                    type="number"
                    placeholder="Номер ячейки (1-999)"
                    value={cellNumber}
                    onChange={(e) => setCellNumber(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="1"
                    max="999"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <Button
            onClick={() => handleAssign(selectedFunction)}
            disabled={!selectedFunction}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Icon name="Check" size={16} className="mr-2" />
            Привязать к функции
          </Button>
          
          <Button
            onClick={onSkip}
            variant="outline"
            className="px-6"
          >
            <Icon name="SkipForward" size={16} className="mr-2" />
            Пропустить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;