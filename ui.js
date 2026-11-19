// ui.js — универсальный «рендер» экрана.
// Умеет бесшовно переключать текст ↔ фото.
// Если редактирование невозможно (текст ↔ фото), удаляет и шлёт заново.

async function showScreen(ctx, { text, keyboard, photo = null }) {
  const isCallback = Boolean(ctx.callbackQuery);

  // Не из кнопки (например, из /start) — всегда новое сообщение
  if (!isCallback) {
    if (photo) return ctx.replyWithPhoto(photo, { caption: text, parse_mode: 'HTML', ...keyboard });
    return ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
  }

  const msg = ctx.callbackQuery.message;
  const hasPhoto = Boolean(msg && msg.photo);

  try {
    if (photo && hasPhoto) {
      await ctx.editMessageCaption(text, { parse_mode: 'HTML', ...keyboard });
    } else if (!photo && !hasPhoto) {
      await ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard });
    } else {
      // Смена типа сообщения: удаляем и шлём заново
      await ctx.deleteMessage().catch(() => {});
      if (photo) {
        await ctx.replyWithPhoto(photo, { caption: text, parse_mode: 'HTML', ...keyboard });
      } else {
        await ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
      }
    }
  } catch (err) {
    // Игнорируем безвредную ошибку «текст не изменился»
    const m = String(err.description || err.message || '');
    if (!m.includes('message is not modified')) throw err;
  }
}

module.exports = { showScreen };