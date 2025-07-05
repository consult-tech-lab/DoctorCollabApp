import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(config);

export async function summarizeText(text) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Summarize this medical text in plain English:\n\n${text}`,
        },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    return `Summary failed: ${error.message}`;
  }
}