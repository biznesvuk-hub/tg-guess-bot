// keyboards.js — все inline-клавиатуры.

const { Markup } = require('telegraf');

const KEYBOARDS = {
  menu: Markup.inlineKeyboard([
    [Markup.button.callback('🎮 Играть', 'play')],
    [Markup.button.callback('🏆 Мои рекорды', 'stats')], // <-- ВОТ ОНА
    [Markup.button.callback('ℹ️ О боте', 'about')],
    [Markup.button.url('📚 Документация Telegraf', 'https://telegraf.js.org')],
  ]),

  back: Markup.inlineKeyboard([
    [Markup.button.callback('⬅️ Назад в меню', 'menu')],
  ]),

  difficulty: Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Лёгкий', 'start_easy')],
    [Markup.button.callback('🟡 Средний', 'start_medium')],
    [Markup.button.callback('🔴 Сложный', 'start_hard')],
    [Markup.button.callback('⬅️ Назад в меню', 'menu')],
  ]),

  endGame: Markup.inlineKeyboard([
    [Markup.button.callback('🔄 Играть снова', 'play')],
    [Markup.button.callback('🏠 В меню', 'menu')],
  ]),
};

function buildNumberKeyboard(low, high) {
  const buttons = [];
  for (let n = low; n <= high; n++) {
    buttons.push(Markup.button.callback(String(n), `guess_${n}`));
  }
  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(buttons.slice(i, i + 5));
  }
  return Markup.inlineKeyboard(rows);
}

module.exports = { KEYBOARDS, buildNumberKeyboard };