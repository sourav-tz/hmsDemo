const TelegramBot = require('node-telegram-bot-api');
const { logger } = require('./utils/logger');
const {
  handleHelpCommand,
  handleLogoutCommand,
  handleMeCommand,
  handleStartCommand,
  handleVerifyCommand
} = require('./handlers/commandHandler');
const {
  handleComplaintsCommand,
  handleNoticesCommand,
  handleNoticeCommand,
  handleStudentDetailsCommand,
  handleTextMessage
} = require('./handlers/messageHandler');

const token = process.env.BOT_TOKEN;

if (!token) {
  logger.error('BOT_TOKEN is missing. Set BOT_TOKEN in .env before starting the backend.');
  return;
}

const bot = new TelegramBot(token, { polling: true });

logger.info('Telegram bot started in polling mode.');

bot.onText(/^\/start(?:@\w+)?(?:\s|$)/, (message) => {
  handleStartCommand(bot, message);
});

bot.onText(/^\/help(?:@\w+)?(?:\s|$)/, (message) => {
  handleHelpCommand(bot, message);
});

bot.onText(/^\/verify(?:@\w+)?(?:\s|$)/, (message) => {
  handleVerifyCommand(bot, message);
});

bot.onText(/^\/me(?:@\w+)?(?:\s|$)/, (message) => {
  handleMeCommand(bot, message);
});

bot.onText(/^\/logout(?:@\w+)?(?:\s|$)/, (message) => {
  handleLogoutCommand(bot, message);
});

bot.onText(/^\/complaints(?:@\w+)?(?:\s|$)/, (message) => {
  handleComplaintsCommand(bot, message);
});

bot.onText(/^\/notice(?:@\w+)?(?:\s|$)/, (message) => {
  handleNoticeCommand(bot, message);
});

bot.onText(/^\/notices(?:@\w+)?(?:\s|$)/, (message) => {
  handleNoticesCommand(bot, message);
});

bot.onText(/^\/student(?:@\w+)?(?:\s+(\d+))?/, (message, match) => {
  handleStudentDetailsCommand(bot, message, match?.[1] || null);
});

bot.on('message', (message) => {
  handleTextMessage(bot, message);
});

bot.on('polling_error', (error) => {
  logger.error(`Polling error: ${error.message}`);
});

bot.on('error', (error) => {
  logger.error(`Bot error: ${error.message}`);
});

module.exports = bot;
