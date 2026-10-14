import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./style.css";

const form = document.querySelector("#form");
const textInput = document.querySelector("#text");
const languageInput = document.querySelector("#language");
const voiceInput = document.querySelector("#voice");
const resultEl = document.querySelector("#result");
const translatedTextEl = document.querySelector("#translated-text");
const button = form.querySelector('button[type="submit"]');

const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

const toast = (message) => {
  Toastify({
    text: message,
    duration: 2500,
    gravity: "top",
    position: "right",
    className: "bg-zinc-900 text-white rounded-md shadow-sm",
  }).showToast();
};

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
];

languageInput.replaceChildren(new Option("Select language", ""));

supportedLanguages.forEach(({ name, code }) => {
  languageInput.add(new Option(`${name} (${code})`, code));
});

let voices = [];

const populateVoiceInput = () => {
  if (!synth) {
    voiceInput.replaceChildren(new Option("Speech synthesis unavailable", ""));
    voiceInput.disabled = true;
    return;
  }

  voices = synth.getVoices();

  const target = languageInput.value.toLowerCase();

  const matchingVoices = target
    ? voices.filter((voice) =>
        voice.lang.toLowerCase().replaceAll("_", "-").startsWith(target),
      )
    : voices;

  voiceInput.replaceChildren(new Option("Default voice", ""));

  matchingVoices.forEach((voice) => {
    const index = voices.indexOf(voice);
    voiceInput.add(new Option(`${voice.name} (${voice.lang})`, String(index)));
  });

  if (target && matchingVoices.length === 0) {
    voiceInput.options[0].text = "No matching voice available";
  }
};

if (synth) {
  synth.addEventListener("voiceschanged", populateVoiceInput);
}

languageInput.addEventListener("change", populateVoiceInput);
populateVoiceInput();

const speak = (text) => {
  if (!synth) {
    toast("Speech synthesis is not supported in this browser.");
    return;
  }

  if (!text.trim()) {
    toast("There is no translated text to speak.");
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice =
    voiceInput.value !== "" ? voices[Number(voiceInput.value)] : null;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = languageInput.value;
  }

  synth.speak(utterance);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textInput.value.trim();
  const target = languageInput.value;

  if (!text) {
    toast("Please enter some text.");
    textInput.focus();
    return;
  }

  if (!target) {
    toast("Please select a target language.");
    languageInput.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Translating...";

  try {
    const response = await fetch("/api/translator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, target }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Translation failed.");
    }

    if (typeof data.translatedText !== "string") {
      throw new Error("The server returned an invalid translation.");
    }

    translatedTextEl.textContent = data.translatedText;
    resultEl.classList.remove("hidden");

    speak(data.translatedText);
  } catch (error) {
    console.error("Translation error:", error);
    toast(error.message || "Unable to translate text.");
  } finally {
    button.disabled = false;
    button.textContent = "Translate & Speak";
  }
});
