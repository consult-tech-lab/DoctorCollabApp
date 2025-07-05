import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // ✅ This is needed to load your .env file

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Summarize this medical text:\n\n${text}` },
      ],
    });
    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// ✅ Don't forget to actually start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

