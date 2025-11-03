import { Scenes } from "telegraf";
import { chooseDateAndSave, receiveAmount, receiveDescription } from "./utils.ts";

export const exitWizard = new Scenes.WizardScene(
	'exitWizard',
	async (ctx) => {

		await ctx.answerCbQuery();

		await ctx.reply('Digite o valor da saída:');
		
		ctx.wizard.state.data = {
			type: 'exit'
		};

		return ctx.wizard.next();
	},
	receiveAmount,
	receiveDescription,
	chooseDateAndSave
);