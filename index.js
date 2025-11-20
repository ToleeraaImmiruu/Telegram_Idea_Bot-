import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_CHAT_ID;
const PUBLIC_URL = process.env.RENDER_EXTERNAL_URL; // Required for webhook

if (!token) {
  console.error("❌ BOT_TOKEN missing!");
  process.exit(1);
}

if (!PUBLIC_URL) {
  console.error("❌ RENDER_EXTERNAL_URL missing!");
  process.exit(1);
}

// --- Initialize bot using WEBHOOK (NOT polling) ---
const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${PUBLIC_URL}/bot${token}`);

console.log("🤖 Webhook bot running...");

// Webhook route
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// --- Logic Starts Here ---
const users = new Set();

// When bot receives a message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg.from.is_bot) return;

  // Save normal users
  if (chatId != adminId) users.add(chatId);

  // /start command
  if (text === "/start") {
    bot.sendMessage(chatId, "Yaada keessan nuuf ergaa 💡");
    return;
  }

  // Admin broadcast
  if (chatId == adminId) {
    users.forEach((userId) => {
      bot.sendMessage(userId, `📢 Admin: ${text}`);
    });
    return;
  }

  // Forward idea to admin
  bot.sendMessage(adminId, `💡 Idea from user:\n${text}`);
  bot.sendMessage(chatId, "Yaadni keessan Milkaa’inaan ergamee jira ✅");
});

// Start Express
app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT}`);
});
