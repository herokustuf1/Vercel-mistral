const { HfInference } = require("@huggingface/inference");
const TelegramBot = require('telegram-bot-api');

const inference = new HfInference("hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

const bot = new TelegramBot({
    token: 'YOUR_TELEGRAM_BOT_TOKEN',
    updates: {
        enabled: true
    }
});

bot.on('message', async (message) => {
    const chatId = message.chat.id;
    const userMessage = message.text;

    for await (const chunk of inference.chatCompletionStream({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 500,
    })) {
        const botReply = chunk.choices[0]?.delta?.content || "";
        await bot.sendMessage({
            chat_id: chatId,
            text: botReply
        });
    }
});

module.exports = (req, res) => {
    res.send('Bot is running');
};
