import dotenv from "dotenv";
dotenv.config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

// Render port requirement
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Telegram Bot is running on Render!");
});

app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_CHAT_ID;

if (!token) {
  console.error("❌ BOT_TOKEN missing! Add it in Render Environment Variables.");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running...");

// Store user IDs
const users = new Set();

// Handle messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg.from.is_bot) return;

  // Save users except admin
  if (chatId != adminId) {
    users.add(chatId);
  }

  // Start command
  if (text === "/start") {
    bot.sendMessage(chatId, "Yaada keessan nuuf ergaa 💡");
    return;
  }

  // Admin Broadcasting
  if (chatId == adminId) {
    users.forEach((userId) => {
      bot.sendMessage(userId, `📢 Admin: ${text}`);
    });
    return;
  }

  // User idea → forward to admin
  bot.sendMessage(adminId, `💡 New Idea from user:\n${text}`);
  bot.sendMessage(chatId, "Yaadni keessan Milkaa’inaan ergamee jira ✅");
});
