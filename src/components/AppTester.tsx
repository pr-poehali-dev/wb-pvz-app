import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAudio } from '@/hooks/useAudio';

interface AppTesterProps {
  onClose: () => void;
}

const AppTester = ({ onClose }: AppTesterProps) => {
  const { playAudioFile } = useAudio();
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const tests = [
    {
      id: 'audio_cell',
      name: 'Озвучка ячейки',
      description: 'Тест воспроизведения озвучки номера ячейки',
      action: () => playAudioFile('cell', 15)
    },
    {
      id: 'audio_discount',
      name: 'Озвучка скидок',
      description: 'Тест воспроизведения озвучки про скидки',
      action: () => playAudioFile('discount')
    },
    {
      id: 'audio_camera',
      name: 'Озвучка камеры',
      description: 'Тест воспроизведения озвучки про проверку под камерой',
      action: () => playAudioFile('camera')
    },
    {
      id: 'audio_rate',
      name: 'Озвучка оценки',
      description: 'Тест воспроизведения озвучки про оценку приложения',
      action: () => playAudioFile('rate')
    }
  ];

  const runSingleTest = async (test: typeof tests[0]) => {
    setTestResults(prev => ({ ...prev, [test.id]: 'pending' }));
    console.log(`🧪 Запускаю тест: ${test.name}`);
    
    try {
      await test.action();
      setTestResults(prev => ({ ...prev, [test.id]: 'success' }));
      console.log(`✅ Тест успешен: ${test.name}`);
    } catch (error) {
      setTestResults(prev => ({ ...prev, [test.id]: 'error' }));
      console.error(`❌ Тест провален: ${test.name}`, error);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    console.log('🚀 Запускаю полное тестирование приложения...');
    
    for (const test of tests) {
      await runSingleTest(test);
      // Пауза между тестами
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsRunningTests(false);
    console.log('🏁 Тестирование завершено!');
  };

  const getTestStatusIcon = (testId: string) => {
    const status = testResults[testId];
    switch (status) {
      case 'success':
        return <Icon name="CheckCircle" size={16} className="text-green-600" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-red-600" />;
      case 'pending':
        return <Icon name="Loader2" size={16} className="text-blue-600 animate-spin" />;
      default:
        return <Icon name="Circle" size={16} className="text-gray-400" />;
    }
  };

  const getTestStatusColor = (testId: string) => {
    const status = testResults[testId];
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Проверяем состояние localStorage
  const checkAudioFiles = () => {
    const audioFiles = {
      'Ячейки': Array.from({ length: 50 }, (_, i) => `audio_cells_${i + 1}`),
      'Скидки': ['audio_discount'],
      'Камера': ['audio_camera'],
      'Оценка': ['audio_rate']
    };

    return Object.entries(audioFiles).map(([category, keys]) => ({
      category,
      loaded: keys.filter(key => localStorage.getItem(key)).length,
      total: keys.length
    }));
  };

  const audioFilesStatus = checkAudioFiles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="TestTube" size={20} />
            Тестирование приложения
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Статус загруженных файлов */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Icon name="FileAudio" size={16} />
              Состояние аудиофайлов
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {audioFilesStatus.map(({ category, loaded, total }) => (
                <div 
                  key={category}
                  className={`p-3 rounded-lg border ${
                    loaded > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{category}</div>
                  <div className="text-xs text-gray-600">
                    {loaded} / {total} загружено
                  </div>
                  {loaded > 0 && (
                    <Icon name="CheckCircle" size={12} className="text-green-600 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Список тестов */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Icon name="Play" size={16} />
                Функциональные тесты
              </h3>
              <Button
                onClick={runAllTests}
                disabled={isRunningTests}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRunningTests ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                    Выполняю тесты...
                  </>
                ) : (
                  <>
                    <Icon name="PlayCircle" size={16} className="mr-2" />
                    Запустить все тесты
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {tests.map((test) => (
                <div 
                  key={test.id}
                  className={`p-3 rounded-lg border ${getTestStatusColor(test.id)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTestStatusIcon(test.id)}
                      <div>
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="text-xs text-gray-600">{test.description}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(test)}
                      disabled={testResults[test.id] === 'pending'}
                    >
                      <Icon name="Play" size={12} className="mr-1" />
                      Тест
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Инструкции */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              Как использовать
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. <strong>Загрузите аудиофайлы</strong> через "Настроить озвучку"</p>
              <p>2. <strong>Запустите тесты</strong> - они проверят воспроизведение каждого типа озвучки</p>
              <p>3. <strong>Проверьте консоль</strong> - там отображаются подробные логи</p>
              <p>4. <strong>Зелёные тесты</strong> означают успешную работу функций</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppTester;