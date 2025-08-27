import React from 'react';

const SimpleApp = () => {
  const playSound = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      speechSynthesis.speak(utterance);
    }
  };

  return React.createElement('div', {
    style: { 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }
  }, 
    React.createElement('div', {
      style: { 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    },
      React.createElement('h1', {
        style: { 
          textAlign: 'center', 
          fontSize: '2.5em', 
          marginBottom: '30px',
          color: '#1f2937'
        }
      }, '🚀 WB ПВЗ - Система озвучки РАБОТАЕТ!'),

      React.createElement('div', {
        style: { 
          backgroundColor: '#dcfce7', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '1.2em',
          color: '#166534',
          border: '2px solid #22c55e'
        }
      }, '✅ Приложение успешно запущено! Белый экран исправлен!'),

      React.createElement('div', {
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }
      },
        React.createElement('button', {
          onClick: () => playSound('Добро пожаловать в пункт выдачи'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '🚪 Приветствие'),

        React.createElement('button', {
          onClick: () => playSound('Ячейка А15'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '📦 Ячейка'),

        React.createElement('button', {
          onClick: () => playSound('Товары со скидкой, проверьте ВБ кошелек'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '💰 Скидки'),

        React.createElement('button', {
          onClick: () => playSound('Проверьте товар под камерой'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '📷 Проверка'),

        React.createElement('button', {
          onClick: () => playSound('Оцените наш пункт выдачи в приложении'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '⭐ Оценка'),

        React.createElement('button', {
          onClick: () => playSound('Спасибо за покупку, хорошего дня'),
          style: {
            padding: '15px 20px',
            backgroundColor: '#06b6d4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, '👋 Прощание')
      ),

      React.createElement('div', {
        style: { 
          backgroundColor: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }
      },
        React.createElement('h3', {
          style: { marginTop: 0, color: '#374151' }
        }, '✅ Система озвучки готова к работе!'),
        React.createElement('p', {
          style: { 
            marginBottom: 0, 
            fontSize: '14px', 
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '20px'
          }
        }, '🎵 Нажмите любую кнопку выше для тестирования озвучки')
      )
    )
  );
};

export default SimpleApp;