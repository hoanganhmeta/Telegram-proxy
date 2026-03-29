const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));

// Lấy token từ biến môi trường (sẽ cài trên Render sau)
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.get('/', (req, res) => {
  res.send('Proxy Telegram đang chạy! Token an toàn.');
});

// Gửi tin nhắn text
app.post('/send-message', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML' })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gửi ảnh
app.post('/send-photo', async (req, res) => {
  try {
    const { photo, filename, caption } = req.body;
    const imageBuffer = Buffer.from(photo, 'base64');
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', new Blob([imageBuffer], { type: 'image/jpeg' }), filename);
    formData.append('caption', caption);
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gửi audio
app.post('/send-audio', async (req, res) => {
  try {
    const { audio, filename, caption } = req.body;
    const audioBuffer = Buffer.from(audio, 'base64');
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('audio', new Blob([audioBuffer], { type: 'audio/ogg' }), filename);
    formData.append('caption', caption);
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy chạy trên port 3000'));
