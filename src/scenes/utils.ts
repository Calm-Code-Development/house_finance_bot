import { Markup } from 'telegraf';
import db from '../db/inMemoryDB.ts'
import { Transaction } from '../db/entities/transaction.ts';
import { parseDateBR } from '../utils.ts';
import { showMainMenu } from '../commands/mainMenu.ts';

async function returnReply (ctx, date: Date) {

	const { amount, description, type } = ctx.wizard.state.data as any;

	const transaction = new Transaction(ctx.from!.id, type, amount, description, date);

	db.addTransaction(transaction);

	const localeDate = date.toLocaleDateString('pt-BR');
	const stringType = type === 'entry' ? 'Entrada' : 'Saída';

	await ctx.reply(
		`[${localeDate}] ${stringType} de R$ ${amount.toFixed(2)} adicionada: ${description}`
	);

	await showMainMenu(ctx);
	return ctx.scene.leave();
}

export const receiveAmount = async (ctx) => {

	const amount = parseFloat((ctx.message as any).text);
	
	if (isNaN(amount)) {

		await ctx.reply('Valor inválido. Digite um número, ex: 1500.50');
		return;
	}

	ctx.wizard.state.data.amount = amount;
	await ctx.reply('Agora digite a descrição:');
	return ctx.wizard.next();
};

export const receiveDescription = async (ctx) => {

	const description = (ctx.message as any).text;

	ctx.wizard.state.data.description = description;
	await ctx.reply(
		'📅 Escolha a data ou digite manualmente (DD/MM/YYYY ou YYYY-MM-DD):',
		Markup.inlineKeyboard([
			[Markup.button.callback('📆 Hoje', 'hoje')],
			[Markup.button.callback('✏️ Digitar data', 'manual')],
		])
	);

	return ctx.wizard.next();
};

export const chooseDateAndSave = async (ctx) => {

	if ('callbackQuery' in ctx && ctx.callbackQuery?.data) {
		
		await ctx.answerCbQuery();

		if (ctx.callbackQuery.data === 'manual') {
			await ctx.reply('✏️ Digite a data no formato DD/MM/YYYY ou YYYY-MM-DD:');
			return;
		}

		const date = new Date;

		await returnReply(ctx, date);
	};

	if (!('message' in ctx) || !ctx.message?.text) return;

	const dateInput = ctx.message.text.trim();
	const date = parseDateBR(dateInput);

	if (!date) {
		
		await ctx.reply('Data inválida. Use DD/MM/YYYY ou YYYY-MM-DD.');
		return;
	}

	await returnReply(ctx, date);
};