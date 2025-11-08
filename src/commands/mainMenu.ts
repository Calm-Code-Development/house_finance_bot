import { Context, Markup } from "telegraf";
import { replyOrEdit } from '../utils.js';
import { clearWizardDraft } from '../scenes/utils.js';

export async function showMainMenu(ctx: Context) {

	try { 

		await clearWizardDraft(ctx as any);
	} catch (e) { /* silencioso */ }
	
	const firstName = ctx.from?.first_name || '';
	const text = `O que você gostaria de fazer agora, ${firstName}?`;
	const markup = Markup.inlineKeyboard([
		[Markup.button.callback('➕ Nova Entrada', 'add_entry')],
		[Markup.button.callback('➖ Nova Saída', 'add_exit')],
		[Markup.button.callback('📊 Ver Balanço', 'show_balance')],
	]);

	return replyOrEdit(ctx, text, { reply_markup: markup.reply_markup });
}