// config.js — конфигурация приложения.
// Здесь и ТОЛЬКО здесь читается .env, поэтому все остальные модули
// получают настройки через require('./config'), а не из process.env напрямую.

require('dotenv').config();

module.exports = {
  // Токен бота (из .env). Проверяется в index.js при старте.
  BOT_TOKEN: process.env.BOT_TOKEN,

  // URL картинки-баннера на экранах меню и «О боте».
  // Хотите свою картинку — замените на { source: './banner.jpg' }.
  BANNER_URL: 'https://picsum.photos/seed/gamebot/800/400',

  // Параметры сложности
  DIFFICULTIES: {
    easy:   { label: '🟢 Лёгкий',  min: 1, max: 10, maxAttempts: 5  },
    medium: { label: '🟡 Средний', min: 1, max: 25, maxAttempts: 7  },
    hard:   { label: '🔴 Сложный', min: 1, max: 50, maxAttempts: 10 },
  },
};