import 'dotenv/config';
import { Telegraf, Scenes, session } from 'telegraf';
import { entryWizard } from './scenes/entryWizard.js';
import { exitWizard } from './scenes/exitWizard.js';
import { registerStart } from './commands/start.js';
import { registerBalance } from './commands/balance.js';

export function setupBot() {
	if (!process.env.BOT_KEY) {

		console.error('API KEY is missing!');
		throw new Error('Cannot find API KEY');
	}

	const apiKey = process.env.BOT_KEY || '';

	const bot = new Telegraf(apiKey);

	const stage = new Scenes.Stage([entryWizard, exitWizard]);
	bot.use(session());
	bot.use(stage.middleware());

	registerStart(bot);
	registerBalance(bot);

	bot.action('add_entry', (ctx) => ctx.scene.enter('entryWizard'));

	bot.action('add_exit', (ctx) => ctx.scene.enter('exitWizard'));

	bot.command('entrada' , (ctx) => ctx.scene.enter('entryWizard'))
	bot.command('saida', (ctx) => ctx.scene.enter('exitWizard'));

	return bot;
}

