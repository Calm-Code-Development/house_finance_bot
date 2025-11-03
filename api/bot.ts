import 'dotenv/config';
import { setupBot } from '../src/index';

const bot = setupBot();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      return res.status(200).send('ok');
    } catch (err) {
      console.error('Erro no webhook:', err);
      return res.status(500).send('error');
    }
  }

  return res.status(200).send('Bot ativo 🚀');
}