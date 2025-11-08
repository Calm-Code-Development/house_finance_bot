import { Context } from 'telegraf';

export function parseDateBR(input: string): Date | null {
  // Primeiro tenta o formato DD/MM/YYYY
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const day = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10) - 1;
    const year = parseInt(match[3]!, 10);
    return new Date(year, month, day);
  }

  // Depois tenta YYYY-MM-DD (como usuário também pode digitar)
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]!, 10);
    const month = parseInt(isoMatch[2]!, 10) - 1;
    const day = parseInt(isoMatch[3]!, 10);
    return new Date(year, month, day);
  }

  return null; // formato inválido
}
/**
 * Try to edit an existing menu message saved in session or edit the message that triggered
 * the callback. If editing fails, send a new message and save its id in session.menuMessageId.
 *
 * Note: session typing is not defined in the project, so this uses (ctx as any).session.
 */
export async function replyOrEdit(ctx: Context, text: string, extra?: any) {
  const session = (ctx as any).session || {};

  try {
    
	if (ctx.callbackQuery) {
      try {

        return await ctx.editMessageText(text, extra);
      } catch (e) {
        // fallthrough to other edit attempts
      }
    }

	if (session.menuMessageId && ctx.chat && ctx.chat.id) {
      try {
        await ctx.telegram.editMessageText(ctx.chat.id, session.menuMessageId, undefined, text, extra);
        return;
      } catch (e) {
        // editing failed (message deleted or too old) -> fallback to sending
      }
    }

    const msg = await ctx.reply(text, extra);
    (ctx as any).session = { ...session, menuMessageId: msg.message_id };
    return msg;
  } catch (err) {

    return ctx.reply(text, extra);
  }
}