import TelegramBot from 'node-telegram-bot-api';
import { readEnv } from '../readEnv';
import { dateDb } from '../utils/date';

readEnv();

const token = process.env.BOT_TOKEN!;
const chatID = +process.env.CHAT_ID!;

const api = new TelegramBot(token, { polling: true });

export const bot = {
    log: (message: string) => {
        api.sendMessage(chatID, message);
    },
    logDate: (message: string) => {
        const fullMsg = `${dateDb.dateNow()}\n${message}`;
        api.sendMessage(chatID, fullMsg);
    },
};

api.on('message', async (msg) => {
    console.log(msg.chat.id, msg.message_thread_id);
});
