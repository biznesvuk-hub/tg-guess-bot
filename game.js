// game.js — «мозг» игры: состояние партий и логика ходов.
// Никаких Telegraf/Telegram тут нет — только чистые данные.
// Это делает модуль тестируемым и не привязывает его к UI.

const { DIFFICULTIES } = require('./config');

// Хранилище активных партий: user_id → объект игры
const games = new Map();

// Склонение слова «попытка».
// form = 'nom' → «попытка/попытки/попыток»
// form = 'acc' → «попытку/попытки/попыток»
function pluralAttempts(n, form) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return form === 'nom' ? 'попытка' : 'попытку';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'попытки';
  return 'попыток';
}

// Создаёт новую партию. Возвращает параметры для отображения.
// null — если сложность неизвестна.
function startGame(userId, difficultyKey) {
  const cfg = DIFFICULTIES[difficultyKey];
  if (!cfg) return null;

  const secret = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min;
  const game = {
    secret,
    attempts: 0,
    maxAttempts: cfg.maxAttempts,
    low: cfg.min,
    high: cfg.max,
  };
  games.set(userId, game);

  return { low: game.low, high: game.high, maxAttempts: game.maxAttempts };
}

// Обрабатывает ход. Возвращает объект со status:
//   'not_found'    — партии нет
//   'out_of_range' — число вне диапазона (устаревшая кнопка)
//   'win'          — победа (secret, attempts)
//   'lose'         — поражение (secret)
//   'continue'     — продолжаем (hint: 'up'|'down', low, high, attempts, maxAttempts)
function handleGuess(userId, guess) {
  const game = games.get(userId);
  if (!game) return { status: 'not_found' };
  if (guess < game.low || guess > game.high) return { status: 'out_of_range' };

  game.attempts++;

  if (guess === game.secret) {
    games.delete(userId);
    return { status: 'win', secret: game.secret, attempts: game.attempts };
  }

  if (guess < game.secret) game.low = Math.max(game.low, guess + 1);
  else game.high = Math.min(game.high, guess - 1);

  if (game.attempts >= game.maxAttempts) {
    games.delete(userId);
    return { status: 'lose', secret: game.secret };
  }

  return {
    status: 'continue',
    hint: guess < game.secret ? 'up' : 'down',
    low: game.low,
    high: game.high,
    attempts: game.attempts,
    maxAttempts: game.maxAttempts,
  };
}

// Сбрасывает партию игрока (например, при /start или переходе в меню)
function resetGame(userId) {
  games.delete(userId);
}

module.exports = { pluralAttempts, startGame, handleGuess, resetGame };