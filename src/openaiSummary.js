import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure your .env has this key
});

export async function summarizeText(text) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Summarize this medical text in plain English:\n\n${text}`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get summary from OpenAI');
  }
}
