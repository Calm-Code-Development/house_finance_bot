import { Context } from 'telegraf';

export function parseDateBR(input: string): Date | null {
  // Primeiro tenta o formato DD/MM/YYYY
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS months 0-11
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }

  // Depois tenta YYYY-MM-DD (como usuário também pode digitar)
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month, day);
  }

  return null; // formato inválido
}

/**
 * Tenta editar a mensagem do menu salva em sessão; caso não consiga, envia uma nova mensagem.
 * Salva o message_id da última mensagem de menu em ctx.session.menuMessageId.
 *
 * Observações:
 * - Usa "as any" para sessão dado que ctx.session não tem tipo explícito no projeto atual.
 * - 'extra' é o mesmo objeto de opções do Telegraf (parse_mode, reply_markup, etc).
 */
export async function replyOrEdit(ctx: Context, text: string, extra?: any) {
  const session = (ctx as any).session || {};
  // Se estamos em um callback query, preferimos editar a mensagem atual via ctx.editMessageText
  try {
    if (ctx.callbackQuery) {
      // tenta editar a mensagem que originou o callback
      try {
        const edited = await ctx.editMessageText(text, extra);
        return edited;
      } catch (e) {
        // se falhar (por exemplo: edição não permitida), cairá para o fallback
      }
    }

    // Se temos um menuMessageId salvo, tente editar pelo telegram API (chatId + messageId)
    if (session.menuMessageId && ctx.chat && ctx.chat.id) {
      try {
        await ctx.telegram.editMessageText(ctx.chat.id, session.menuMessageId, undefined, text, extra);
        return;
      } catch (e) {
        // falhou editar — talvez a mensagem foi removida ou tempo excedido
      }
    }

    // Fallback: enviar nova mensagem e salvar id na sessão
    const msg = await ctx.reply(text, extra);
    (ctx as any).session = { ...session, menuMessageId: msg.message_id };
    return msg;
  } catch (err) {
    // último recurso: apenas tentar enviar (evita crash)
    return ctx.reply(text, extra);
  }
}