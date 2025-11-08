import { Markup, Telegraf } from 'telegraf';
import { showMainMenu } from './mainMenu.js';
import { getAllForUser, getBalanceMonth } from '../db/index.js';
import { replyOrEdit } from '../utils.js';

function formatMonthName(date: Date) {
	return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

const getBalance = async (ctx: any) => {

	await ctx.answerCbQuery();

	const userId = ctx.from!.id;
	const transactions = await getAllForUser(userId);

	if (!transactions.length) {

		await replyOrEdit(
			ctx,
			'Você ainda não possui transações registradas.',
			{ 
				reply_markup: Markup.inlineKeyboard([
					[Markup.button.callback(
						'🔙 Voltar ao menu',
						'back_to_menu'
					)]
				]).reply_markup
			});
		return;
	}

	const months = Array.from(new Set(
		transactions.map(transaction => {
			const date = new Date(transaction.date);
			return `${date.getFullYear()}-${date.getMonth()}`
		})
	));

	// Cria botões dinamicamente
		const buttons = months.map((m) => {

			const parts = m.split('-');

			const year = Number(parts[0]);
			const month = Number(parts[1]);

			const label = formatMonthName(new Date(year, month, 1));
			return [Markup.button.callback(label, `balance_${year}_${month}`)];
		});

	await replyOrEdit(ctx,
		'📅 Escolha o mês para ver o balanço:',
		{ reply_markup: Markup.inlineKeyboard(buttons).reply_markup }
	);
};

export function registerBalance(bot: Telegraf) {
	bot.command('balanco', getBalance);
	bot.action('show_balance', getBalance);
		bot.action(/balance_(\d{4})_(\d{1,2})/, async (ctx: any) => {
		await ctx.answerCbQuery();

		const userId = ctx.from!.id;
			const [, yearStr, monthStr] = ctx.match;
			const year = parseInt(yearStr!);
			const month = parseInt(monthStr!) + 1;

		const totals: any[] = await getBalanceMonth(userId, year, month);

		const balance = totals.reduce((total, typeBalance) => {
			return total + Number(typeBalance.total)
		}, 0);

		const text =
			`📅 *Balanço do mês*\n\n` +
			`📊 Saldo: *R$ ${balance}*`;

		const backKeyboard = Markup.inlineKeyboard([
			[Markup.button.callback('🔙 Voltar ao menu', 'back_to_menu')]
		]);

		await replyOrEdit(
			ctx,
			text, 
			{ 
				parse_mode: 'Markdown',
				reply_markup: backKeyboard.reply_markup 
			}
		);
		return;
	});

	// handler para voltar ao menu quando o usuário clicar no botão
	bot.action('back_to_menu', async (ctx) => {
		await ctx.answerCbQuery();
		return showMainMenu(ctx);
	});
}