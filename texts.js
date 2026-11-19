// texts.js — все тексты интерфейса в одном месте.

const TEXTS = {
  menu: `<b>🎮 Добро пожаловать в игру «Угадай число»!</b>

Я загадаю число, а ты попробуешь его отгадать.
Выбирай действие на кнопках ниже 👇`,

  about: `<b>ℹ️ О боте</b>

Это учебный проект на <b>Node.js</b> и библиотеке <b>Telegraf</b>.

🔗 Документация: <a href="https://telegraf.js.org">telegraf.js.org</a>`,

  // НОВЫЙ ТЕКСТ ДЛЯ СТАТИСТИКИ:
  stats: ({ games, wins, best, bestText }) => `<b>🏆 Мои рекорды</b>

🎮 Сыграно партий: <b>${games}</b>
🥇 Побед: <b>${wins}</b>
⭐ Лучший результат: ${best ? `<b>${best}</b> ${bestText}` : 'пока нет'}`,

  difficulty: `<b>🎲 Выбери сложность</b>

🟢 <b>Лёгкий</b> — от 1 до 10, 5 попыток
🟡 <b>Средний</b> — от 1 до 25, 7 попыток
🔴 <b>Сложный</b> — от 1 до 50, 10 попыток`,

  gameStart: ({ low, high, maxAttempts, attemptsNoun }) => `<b>🎲 Угадай число</b>

Я загадал число в диапазоне <b>${low}–${high}</b>.
У тебя <b>${maxAttempts}</b> ${attemptsNoun}.
Выбирай число на кнопках ниже 👇`,

  continueGame: ({ hintText, low, high, attempts, maxAttempts }) => `<b>🎲 Угадай число</b>

${hintText}.
Диапазон: <b>${low}–${high}</b>
Попытка: <b>${attempts}/${maxAttempts}</b>`,

  win: ({ secret, attempts, attemptsNounAcc }) => `<b>🎉 Победа!</b>

Ты угадал число <b>${secret}</b> за <b>${attempts}</b> ${attemptsNounAcc}!
Отличная работа 👏`,

  lose: ({ secret }) => `<b>😢 Попытки кончились</b>

Я загадал число <b>${secret}</b>.
Не расстраивайся — попробуй ещё раз!`,

  notFound: 'Игра не найдена. Нажми «🎮 Играть».',
  outOfRange: 'Это число уже вне диапазона',
};

module.exports = { TEXTS };