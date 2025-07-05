import axios from 'axios';

export async function translateText(text, targetLang = 'es') {
  try {
    const response = await axios.post(
      'https://translation.googleapis.com/language/translate/v2',
      {},
      {
        params: {
          q: text,
          target: targetLang,
          key: 'YOUR_GOOGLE_TRANSLATE_API_KEY',
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    return `Translation failed: ${error.message}`;
  }
}