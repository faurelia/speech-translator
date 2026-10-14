import { AccessKey, Translator } from "@translated/lara";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const keyId = process.env.LARA_ACCESS_KEY_ID;
const secret = process.env.LARA_ACCESS_KEY_SECRET;

const supportedLanguageCodes = new Set([
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "ko",
  "zh-CN",
]);

let lara;

if (keyId && secret) {
  const accessKey = new AccessKey(keyId, secret);
  lara = new Translator(accessKey);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!lara) {
    console.error("Lara API credentials are missing.");

    return res.status(500).json({
      error: "Translation service is not configured.",
    });
  }

  const { text, target } = req.body || {};

  if (typeof text !== "string" || !text.trim() || text.length > 1000) {
    return res.status(400).json({
      error: "Enter text between 1 and 1000 characters.",
    });
  }

  if (typeof target !== "string" || !supportedLanguageCodes.has(target)) {
    return res.status(400).json({
      error: "Unsupported target language.",
    });
  }

  try {
    const result = await lara.translate(text, null, target);

    return res.status(200).json({
      translatedText: result.translation,
    });
  } catch (error) {
    console.error("Lara translation error:", error);

    return res.status(500).json({
      error: "Translation failed. Please try again.",
    });
  }
}
