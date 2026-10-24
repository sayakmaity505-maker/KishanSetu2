import type { Lang } from "../auth";

export const BHASHINI_LANGUAGE: Record<Lang, { locale: string; name: string; native: string }> = {
  en: { locale: "en-IN", name: "English", native: "English" },
  hi: { locale: "hi-IN", name: "Hindi", native: "हिंदी" },
  bn: { locale: "bn-IN", name: "Bengali", native: "বাংলা" },
  ta: { locale: "ta-IN", name: "Tamil", native: "தமிழ்" },
  te: { locale: "te-IN", name: "Telugu", native: "తెలుగు" },
  mr: { locale: "mr-IN", name: "Marathi", native: "मराठी" },
  gu: { locale: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
  pa: { locale: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  kn: { locale: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ" },
  or: { locale: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ" },
  ml: { locale: "ml-IN", name: "Malayalam", native: "മലയാളം" },
};

export type VoiceProvider = "bhashini" | "device";

let activeAudio: HTMLAudioElement | null = null;

function stopCurrentSpeech() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function findLanguageVoice(lang: Lang) {
  const locale = BHASHINI_LANGUAGE[lang].locale.toLowerCase();
  const base = locale.split("-")[0];
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(voice => voice.lang.toLowerCase() === locale)
    ?? voices.find(voice => voice.lang.toLowerCase().startsWith(`${base}-`))
    ?? voices.find(voice => voice.lang.toLowerCase() === base)
    ?? null
  );
}

async function speakWithDevice(text: string, lang: Lang) {
  if (!("speechSynthesis" in window)) throw new Error("Speech synthesis is not supported by this browser.");
  let voice = findLanguageVoice(lang);
  if (!voice && window.speechSynthesis.getVoices().length === 0) {
    await new Promise(resolve => window.setTimeout(resolve, 180));
    voice = findLanguageVoice(lang);
  }

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = BHASHINI_LANGUAGE[lang].locale;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = event => reject(new Error(event.error || "Unable to play voice narration."));
    window.speechSynthesis.speak(utterance);
  });
}

function getAudioContent(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload as Record<string, any>;
  return (
    value.audioContent
    ?? value.audio?.[0]?.audioContent
    ?? value.pipelineResponse?.[0]?.audio?.[0]?.audioContent
    ?? value.pipelineResponse?.[0]?.output?.[0]?.audioContent
    ?? null
  );
}

async function speakWithBhashiniProxy(text: string, lang: Lang, endpoint: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: lang,
      sourceLanguage: lang,
      locale: BHASHINI_LANGUAGE[lang].locale,
      text,
      taskType: "tts",
      gender: "female",
    }),
  });
  if (!response.ok) throw new Error(`Bhashini voice request failed (${response.status}).`);
  const payload = await response.json();
  const audioContent = getAudioContent(payload);
  if (!audioContent) throw new Error("Bhashini response did not include audio.");

  await new Promise<void>((resolve, reject) => {
    activeAudio = new Audio(
      audioContent.startsWith("data:") ? audioContent : `data:audio/wav;base64,${audioContent}`
    );
    activeAudio.onended = () => {
      activeAudio = null;
      resolve();
    };
    activeAudio.onerror = () => reject(new Error("Unable to play Bhashini audio."));
    activeAudio.play().catch(reject);
  });
}

export async function speakBhashini(text: string, lang: Lang): Promise<VoiceProvider> {
  stopCurrentSpeech();
  const endpoint = import.meta.env.VITE_BHASHINI_TTS_PROXY_URL?.trim();
  if (endpoint) {
    try {
      await speakWithBhashiniProxy(text, lang, endpoint);
      return "bhashini";
    } catch (error) {
      console.warn("Bhashini TTS unavailable; using the matching device voice.", error);
    }
  }
  await speakWithDevice(text, lang);
  return "device";
}

export async function askBhashini(text: string, lang: Lang, role: "farmer" | "agent") {
  const endpoint = import.meta.env.VITE_BHASHINI_ASSISTANT_PROXY_URL?.trim();
  if (!endpoint) return null;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: lang, role }),
  });
  if (!response.ok) throw new Error(`Bhashini assistant request failed (${response.status}).`);
  const payload = await response.json();
  return typeof payload.answer === "string" ? payload.answer : null;
}

export { stopCurrentSpeech };
