import { Scenes } from "telegraf";
import {
	chooseDateAndSave,
	receiveAmount,
	receiveDescription
} from "./utils.ts";

export const entryWizard = new Scenes.WizardScene(
	'entryWizard',
	async (ctx) => {

		await ctx.answerCbQuery();

		await ctx.reply('Digite o valor da entrada:');
		
		ctx.wizard.state.data = {
			type: 'entry'
		};

		return ctx.wizard.next();
	},
	receiveAmount,
	receiveDescription,
	chooseDateAndSave
);