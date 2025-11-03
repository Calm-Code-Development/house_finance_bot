import { Context, Markup } from "telegraf";

export function showMainMenu(ctx: Context) {
	const firstName = ctx.from?.first_name;
	return ctx.reply(
		`O que você gostaria de fazer agora, ${firstName}?`,
		Markup.inlineKeyboard([
			[Markup.button.callback('➕ Nova Entrada', 'add_entry')],
			[Markup.button.callback('➖ Nova Saída', 'add_exit')],
			[Markup.button.callback('📊 Ver Balanço', 'show_balance')],
		])
	);
}