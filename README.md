# Speech Translator

A lightweight browser app that translates text and reads it aloud using the Web Speech API and a serverless translation endpoint.

## Features

- Translate text into supported languages
- Speak the translated result using the browser's voice synthesis engine
- Use a serverless API route for translation requests
- Works with browser voice selection by OS/browser

## Tech stack

- Frontend: Vite + vanilla JavaScript
- Speech: Web Speech API (`speechSynthesis`)
- Translation: Lara Translate API
- Hosting: Vercel serverless functions

## Prerequisites

- Node.js 18+
- npm or pnpm
- A Lara Translate API account

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

   or:

   ```bash
   pnpm install
   ```

2. Create a local environment file named `.env` (or `.env.local`) and add your Lara credentials:

   ```bash
   LARA_ACCESS_KEY_ID="your-access-key-id"
   LARA_ACCESS_KEY_SECRET="your-access-key-secret"
   ```

   You can get these from your Lara Translate dashboard.

3. Start the app locally:

   ```bash
   npx vercel dev
   ```

   The app will run on the local Vercel development server, typically at:

   ```text
   http://localhost:3000
   ```

## Supported languages

The API currently accepts these target language codes:

- `en`
- `es`
- `fr`
- `de`
- `ja`
- `ko`
- `zh-CN`

## API endpoint

Send a POST request to:

```http
POST http://localhost:3000/api/translator
Content-Type: application/json
```

Example body:

```json
{
  "text": "Hello, how are you?",
  "target": "es"
}
```

Example response:

```json
{
  "translatedText": "Hola, ¿cómo estás?"
}
```

## Notes

- The available voices depend on the operating system and browser.
- Lara Translate's free tier includes a monthly character allowance; check the current plan details for limits.
- The translation service requires valid credentials to be configured in the environment before requests can succeed.

## Production deployment

Deploy to Vercel with your environment variables configured in the project settings:

```bash
vercel
```
