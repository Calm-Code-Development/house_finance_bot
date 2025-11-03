import { Telegraf, Markup } from 'telegraf';

export function registerStart(bot: Telegraf) {
  bot.start((ctx) => {
	const firstName = ctx.from?.first_name;
    ctx.reply(
      `👋 Boas vindas ao seu organizador financeiro, ${firstName}!\nEscolha uma opção abaixo:`,
      Markup.inlineKeyboard([
        [Markup.button.callback('➕ Nova Entrada', 'add_entry')],
        [Markup.button.callback('➖ Nova Saída', 'add_exit')],
        [Markup.button.callback('📊 Ver Balanço', 'show_balance')],
      ])
    );
  });
}