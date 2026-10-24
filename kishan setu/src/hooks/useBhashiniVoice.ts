import { useCallback, useEffect, useState } from "react";
import type { Lang } from "../auth";
import { speakBhashini, stopCurrentSpeech, VoiceProvider } from "../services/bhashini";

export function useBhashiniVoice(lang: Lang) {
  const [status, setStatus] = useState<"idle" | "speaking" | "error">("idle");
  const [provider, setProvider] = useState<VoiceProvider | null>(null);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    stopCurrentSpeech();
    setStatus("idle");
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setError("");
    setStatus("speaking");
    try {
      const usedProvider = await speakBhashini(text, lang);
      setProvider(usedProvider);
      setStatus("idle");
    } catch (voiceError) {
      setError(voiceError instanceof Error ? voiceError.message : "Voice playback failed.");
      setStatus("error");
    }
  }, [lang]);

  useEffect(() => stop, [stop]);

  return { speak, stop, status, provider, error };
}
