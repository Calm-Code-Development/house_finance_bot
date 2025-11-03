import { Markup, Telegraf } from 'telegraf';
import db from '../db/inMemoryDB.ts';
import { showMainMenu } from './mainMenu.ts';

function formatMonthName(date: Date) {
	return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

const getBalance = async (ctx) => {
	await ctx.answerCbQuery();
	const userId = ctx.from!.id;

	const transactions = db.getAllForUser(userId);

	if(!transactions.length) {
		await ctx.reply('Você ainda não possui transações registradas.');
		return showMainMenu(ctx);
	}

	const months = Array.from(
		new Set(transactions.map(transaction => `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`))
	);

	// Cria botões dinamicamente
	const buttons = months.map((m) => {
		const [year, month] = m.split('-').map(Number);
		const label = formatMonthName(new Date(year, month, 1));
		return [Markup.button.callback(label, `balance_${year}_${month}`)];
	});

	await ctx.reply(
		'📅 Escolha o mês para ver o balanço:',
		Markup.inlineKeyboard(buttons)
	);
};

export function registerBalance(bot: Telegraf) {
	bot.command('balanco', getBalance);
	bot.action('show_balance', getBalance);
	bot.action(/balance_(\d{4})_(\d{1,2})/, async (ctx) => {
		await ctx.answerCbQuery();

		const userId = ctx.from!.id;
		const [, yearStr, monthStr] = ctx.match;
		const year = parseInt(yearStr);
		const month = parseInt(monthStr) + 1;

		const balance = db.getBalanceMonth(
			userId,
			year,
			month
		);

		await ctx.reply(
		`📅 *Balanço do mês*\n\n` +
		`📊 Saldo: *R$ ${balance.toFixed(2)}*`,
		{ parse_mode: 'Markdown' }
	);
	await showMainMenu(ctx);
	});
}