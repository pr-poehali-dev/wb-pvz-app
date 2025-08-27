import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BasicTester = () => {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🎵 Тест озвучки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => speak('Ячейка А15')} size="sm">
            Ячейка
          </Button>
          <Button onClick={() => speak('Товары со скидкой, проверьте ВБ кошелек')} size="sm">
            Скидки
          </Button>
          <Button onClick={() => speak('Проверьте товар под камерой')} size="sm">
            Проверка
          </Button>
          <Button onClick={() => speak('Оцените наш пункт выдачи в приложении')} size="sm">
            Оценка
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicTester;