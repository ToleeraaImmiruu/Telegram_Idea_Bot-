import TelegramBot from "node-telegram-bot-api";

// Use environment variables (for Render)
const token = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });
console.log("🤖 Bot is running...");

// Store all user IDs
const users = new Set();

// Safe message sending to prevent crashes
const safeSendMessage = (chatId, text) => {
    bot.sendMessage(chatId, text).catch((err) => {
        if (err.response && err.response.statusCode === 403) {
            console.log(`⚠️ Cannot send message to ${chatId}, user blocked the bot or never started it.`);
        } else {
            console.error(err);
        }
    });
};

// Listen for messages
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    // Ignore bot messages
    if (msg.from.is_bot) return;

    // Track users (exclude admin)
    if (chatId !== parseInt(ADMIN_CHAT_ID)) {
        users.add(chatId);
    }

    // Handle /start command
    if (userMessage === "/start") {
        safeSendMessage(chatId, "Yaada fi Gorsa Qabduu nuuf kaa'i💡");
        return;
    }

    // Admin broadcasts message to all users
    if (chatId === parseInt(ADMIN_CHAT_ID)) {
        users.forEach((userId) => {
            safeSendMessage(userId, `📢 Admin: ${userMessage}`);
        });
        return;
    }

    // Forward idea to admin
    safeSendMessage(
        parseInt(ADMIN_CHAT_ID),
        `💡 Idea from @${msg.from.username || "unknown"}:\n\n${userMessage}`
    );

    // Confirm to user
    safeSendMessage(chatId, "Yaadni keessaan Milkaa'inaan Ergamee jira✅");
});
