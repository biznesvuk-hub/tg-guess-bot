// storage.js — работа с файлом статистики.
// Используем встроенный модуль fs (File System) для чтения и записи.

const fs = require('fs');
const path = require('path');

// Путь к файлу статистики (в той же папке, где лежит этот скрипт)
const STATS_FILE = path.join(__dirname, 'stats.json');

// Читает файл статистики и возвращает объект.
// Если файла нет — возвращает пустой объект.
function loadStats() {
  if (!fs.existsSync(STATS_FILE)) return {};
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Ошибка чтения stats.json:', err);
    return {}; // Если файл поврежден, возвращаем пустой, чтобы бот не упал
  }
}

// Сохраняет объект статистики в файл.
// JSON.stringify(..., null, 2) делает файл красивым и читаемым.
function saveStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
  } catch (err) {
    console.error('Ошибка записи stats.json:', err);
  }
}

// Обновляет статистику конкретного пользователя.
// isWin — true если победа, attempts — за сколько попыток (для рекорда).
function updateStats(userId, isWin, attempts) {
  const stats = loadStats();
  
  // Если пользователь играет впервые, создаем для него запись
  if (!stats[userId]) {
    stats[userId] = { games: 0, wins: 0, best: null };
  }
  
  stats[userId].games++;
  if (isWin) {
    stats[userId].wins++;
    // Обновляем лучший результат, если это первая победа или новая лучше прошлой
    if (stats[userId].best === null || attempts < stats[userId].best) {
      stats[userId].best = attempts;
    }
  }
  
  saveStats(stats);
}

// Возвращает статистику пользователя (или значения по умолчанию)
function getUserStats(userId) {
  const stats = loadStats();
  return stats[userId] || { games: 0, wins: 0, best: null };
}

module.exports = { updateStats, getUserStats };