// index.js — точка входа.

const { Telegraf } = require('telegraf');

const { BOT_TOKEN, BANNER_URL } = require('./config');
const { TEXTS } = require('./texts');
const { KEYBOARDS, buildNumberKeyboard } = require('./keyboards');
const { showScreen } = require('./ui');
const { pluralAttempts, startGame, handleGuess, resetGame } = require('./game');
const { updateStats, getUserStats } = require('./storage');

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не задан. Проверьте файл .env в корне проекта.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// /start
bot.start((ctx) => {
  resetGame(ctx.from.id);
  return showScreen(ctx, {
    text: TEXTS.menu,
    keyboard: KEYBOARDS.menu,
    photo: BANNER_URL,
  });
});

// «🎮 Играть»
bot.action('play', async (ctx) => {
  resetGame(ctx.from.id);
  await ctx.answerCbQuery();
  await showScreen(ctx, { text: TEXTS.difficulty, keyboard: KEYBOARDS.difficulty });
});

// «ℹ️ О боте»
bot.action('about', async (ctx) => {
  await ctx.answerCbQuery();
  await showScreen(ctx, {
    text: TEXTS.about,
    keyboard: KEYBOARDS.back,
    photo: BANNER_URL,
  });
});

// «🏆 Мои рекорды»
bot.action('stats', async (ctx) => {
  await ctx.answerCbQuery();
  const userStats = getUserStats(ctx.from.id);
  
  await showScreen(ctx, {
    text: TEXTS.stats({
      games: userStats.games,
      wins: userStats.wins,
      best: userStats.best,
      bestText: userStats.best ? pluralAttempts(userStats.best, 'acc') : '', 
    }),
    keyboard: KEYBOARDS.back,
    photo: BANNER_URL,
  });
});

// «⬅️ Назад в меню» / «🏠 В меню»
bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  await showScreen(ctx, {
    text: TEXTS.menu,
    keyboard: KEYBOARDS.menu,
    photo: BANNER_URL,
  });
});

// Выбор сложности
bot.action(/^start_(easy|medium|hard)$/, async (ctx) => {
  const difficultyKey = ctx.match[1];
  const initial = startGame(ctx.from.id, difficultyKey);
  if (!initial) return ctx.answerCbQuery('Неизвестная сложность', { show_alert: true });

  await ctx.answerCbQuery();
  await showScreen(ctx, {
    text: TEXTS.gameStart({
      low: initial.low,
      high: initial.high,
      maxAttempts: initial.maxAttempts,
      attemptsNoun: pluralAttempts(initial.maxAttempts, 'nom'),
    }),
    keyboard: buildNumberKeyboard(initial.low, initial.high),
  });
});

// Клик по числу
bot.action(/^guess_(\d+)$/, async (ctx) => {
  const guess = parseInt(ctx.match[1], 10);
  const result = handleGuess(ctx.from.id, guess);

  switch (result.status) {
    case 'not_found':
      return ctx.answerCbQuery(TEXTS.notFound, { show_alert: true });

    case 'out_of_range':
      return ctx.answerCbQuery(TEXTS.outOfRange);

    case 'win':
      updateStats(ctx.from.id, true, result.attempts);
      await ctx.answerCbQuery('🎉 Победа!');
      return showScreen(ctx, {
        text: TEXTS.win({
          secret: result.secret,
          attempts: result.attempts,
          attemptsNounAcc: pluralAttempts(result.attempts, 'acc'),
        }),
        keyboard: KEYBOARDS.endGame,
      });

    case 'lose':
      updateStats(ctx.from.id, false, 0);
      await ctx.answerCbQuery('Увы, попытки кончились');
      return showScreen(ctx, {
        text: TEXTS.lose({ secret: result.secret }),
        keyboard: KEYBOARDS.endGame,
      });

    case 'continue':
      await ctx.answerCbQuery(result.hint === 'up' ? '🔼 Больше' : '🔽 Меньше');
      return showScreen(ctx, {
        text: TEXTS.continueGame({
          hintText: result.hint === 'up'
            ? '🔼 Загаданное число <b>больше</b>'
            : '🔽 Загаданное число <b>меньше</b>',
          low: result.low,
          high: result.high,
          attempts: result.attempts,
          maxAttempts: result.maxAttempts,
        }),
        keyboard: buildNumberKeyboard(result.low, result.high),
      });
  }
});

// Глобальный обработчик ошибок
bot.catch((err, ctx) => {
  console.error(`Ошибка при обработке ${ctx.updateType}:`, err);
});

// Запуск
bot.launch();
console.log('Бот запущен! Напиши /start в Telegram');

// Аккуратная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));