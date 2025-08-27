import React, { useState } from 'react';

const SimpleIndex = () => {
  const [message, setMessage] = useState('Добро пожаловать в систему WB ПВЗ!');

  const playSound = (text: string) => {
    setMessage(`🔊 ${text}`);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '2.5em', 
          marginBottom: '30px',
          color: '#1f2937'
        }}>
          🚀 WB ПВЗ - Система озвучки
        </h1>

        <div style={{ 
          backgroundColor: '#eff6ff', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '1.2em',
          color: '#1e40af'
        }}>
          {message}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => playSound('Добро пожаловать, сканируйте QR код')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            🚪 Приветствие
          </button>

          <button
            onClick={() => playSound('Ячейка А15')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            📦 Ячейка
          </button>

          <button
            onClick={() => playSound('Товары со скидкой, проверьте ВБ кошелек')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            💰 Скидки
          </button>

          <button
            onClick={() => playSound('Проверьте товар под камерой')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
          >
            📷 Проверка
          </button>

          <button
            onClick={() => playSound('Оцените наш пункт выдачи в приложении')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            ⭐ Оценка
          </button>

          <button
            onClick={() => playSound('Спасибо за покупку, хорошего дня')}
            style={{
              padding: '15px 20px',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0891b2'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#06b6d4'}
          >
            👋 Прощание
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginTop: 0, color: '#374151' }}>
            ✅ Система работает!
          </h3>
          <ul style={{ color: '#6b7280', lineHeight: '1.6' }}>
            <li>🔊 Голосовая озвучка через синтез речи браузера</li>
            <li>📱 Поддержка QR-кодов и номеров телефонов</li>
            <li>🎯 Автоматизированный процесс выдачи заказов</li>
            <li>⚡ Быстрая и стабильная работа</li>
            <li>🌐 Работает в любом современном браузере</li>
          </ul>
          
          <p style={{ 
            marginBottom: 0, 
            fontSize: '14px', 
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            Нажмите любую кнопку выше для тестирования озвучки
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;