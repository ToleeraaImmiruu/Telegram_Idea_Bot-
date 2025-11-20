import TelegramBot from "node-telegram-bot-api";

// Replace with your bot token (regenerate a new one!)
const token = "8546422751:AAHuFnDJqYU198t4U1IQEVOKaFUbWC1stBY";

// Replace with your admin ID
const ADMIN_CHAT_ID = "5138342853";

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running...");

// Store all user IDs who interacted with the bot
const users = new Set();

// Handle incoming messages
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    // Ignore bot messages
    if (msg.from.is_bot) return;

    // Track user IDs (except admin)
    if (chatId !== ADMIN_CHAT_ID) {
        users.add(chatId);
    }

    // Handle /start command
    if (userMessage === "/start") {
        bot.sendMessage(chatId, "Yaada fi Gorsa Qabduu nuuf kaa'i💡");
        return;
    }

    // If admin sends a message → broadcast to all users
    if (chatId === ADMIN_CHAT_ID) {
        users.forEach((userId) => {
            bot.sendMessage(userId, `📢 Admin: ${userMessage}`);
        });
        return;
    }

    // Forward user's idea to admin
    bot.sendMessage(
        ADMIN_CHAT_ID,
        `💡 Idea from @${msg.from.username || "unknown"}:\n\n${userMessage}`
    );

    // Confirm to user
    bot.sendMessage(chatId, "Yaadni keessaan Milkaa'inaan Ergamee jira✅");
});
