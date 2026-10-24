import { useRef, useState } from "react";
import type { Lang } from "../auth";
import { useAuth } from "../auth";
import { useBhashiniVoice } from "../hooks/useBhashiniVoice";
import { askBhashini, BHASHINI_LANGUAGE } from "../services/bhashini";

interface Props {
  role: "farmer" | "agent";
}

interface AssistantCopy {
  greeting: string;
  prompt: string;
  ask: string;
  listen: string;
  listening: string;
  fallback: string;
  quick: Array<{ label: string; answer: string }>;
}

const COPY: Record<Lang, AssistantCopy> = {
  en: { greeting: "How can I help you today?", prompt: "Ask about centres, slots, payments, or documents", ask: "Ask", listen: "Speak", listening: "Listening…", fallback: "I can help with nearby procurement centres, slot bookings, payments, and document verification. Choose an option below or ask again.", quick: [
    { label: "Nearest centre", answer: "Open Nearby Centres to use your location, compare verified centres, and get Google Maps directions." },
    { label: "My payment", answer: "Open Sales History or Bills to check the PFMS payment status and UTR reference." },
    { label: "Document help", answer: "Open Profile to review KYC, DigiLocker verification, bank details, and linked farmer documents." },
  ] },
  hi: { greeting: "आज मैं आपकी कैसे मदद करूँ?", prompt: "केंद्र, स्लॉट, भुगतान या दस्तावेज़ के बारे में पूछें", ask: "पूछें", listen: "बोलें", listening: "सुन रहा है…", fallback: "मैं नज़दीकी खरीद केंद्र, स्लॉट बुकिंग, भुगतान और दस्तावेज़ सत्यापन में मदद कर सकता हूँ। नीचे विकल्प चुनें या फिर पूछें।", quick: [
    { label: "नज़दीकी केंद्र", answer: "अपना स्थान उपयोग करने, सत्यापित केंद्रों की तुलना करने और गूगल मैप दिशा पाने के लिए पास के केंद्र खोलें।" },
    { label: "मेरा भुगतान", answer: "पीएफएमएस भुगतान की स्थिति और यूटीआर नंबर देखने के लिए बिक्री इतिहास या बिल खोलें।" },
    { label: "दस्तावेज़ सहायता", answer: "केवाईसी, डिजिलॉकर सत्यापन, बैंक विवरण और जुड़े दस्तावेज़ देखने के लिए प्रोफ़ाइल खोलें।" },
  ] },
  bn: { greeting: "আজ আমি কীভাবে সাহায্য করতে পারি?", prompt: "কেন্দ্র, স্লট, পেমেন্ট বা নথি সম্পর্কে জিজ্ঞাসা করুন", ask: "জিজ্ঞাসা", listen: "বলুন", listening: "শুনছি…", fallback: "আমি কাছের ক্রয়কেন্দ্র, স্লট বুকিং, পেমেন্ট ও নথি যাচাইয়ে সাহায্য করতে পারি। নিচের বিকল্প বেছে নিন।", quick: [
    { label: "কাছের কেন্দ্র", answer: "অবস্থান ব্যবহার করে যাচাইকৃত কেন্দ্র তুলনা ও গুগল ম্যাপ নির্দেশনা পেতে কাছের কেন্দ্র খুলুন।" },
    { label: "আমার পেমেন্ট", answer: "পিএফএমএস পেমেন্ট অবস্থা ও ইউটিআর দেখতে বিক্রয় ইতিহাস বা বিল খুলুন।" },
    { label: "নথি সহায়তা", answer: "কেওয়াইসি, ডিজিলকার যাচাই ও সংযুক্ত নথি দেখতে প্রোফাইল খুলুন।" },
  ] },
  ta: { greeting: "இன்று நான் எப்படி உதவலாம்?", prompt: "மையம், ஸ்லாட், பணம் அல்லது ஆவணம் பற்றி கேளுங்கள்", ask: "கேளுங்கள்", listen: "பேசுங்கள்", listening: "கேட்கிறது…", fallback: "அருகிலுள்ள கொள்முதல் மையம், ஸ்லாட் பதிவு, பணம் மற்றும் ஆவண சரிபார்ப்பில் உதவ முடியும். கீழே ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்.", quick: [
    { label: "அருகிலுள்ள மையம்", answer: "உங்கள் இருப்பிடத்தைப் பயன்படுத்தி மையங்களை ஒப்பிட்டு கூகுள் மேப்ஸ் வழியைப் பெற அருகிலுள்ள மையங்களைத் திறக்கவும்." },
    { label: "என் பணம்", answer: "PFMS பண நிலை மற்றும் UTR எண்ணைப் பார்க்க விற்பனை வரலாறு அல்லது பில்களைத் திறக்கவும்." },
    { label: "ஆவண உதவி", answer: "KYC, டிஜிலாக்கர் சரிபார்ப்பு மற்றும் இணைக்கப்பட்ட ஆவணங்களைப் பார்க்க சுயவிவரத்தைத் திறக்கவும்." },
  ] },
  te: { greeting: "ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?", prompt: "కేంద్రం, స్లాట్, చెల్లింపు లేదా పత్రాల గురించి అడగండి", ask: "అడగండి", listen: "మాట్లాడండి", listening: "వింటోంది…", fallback: "సమీప సేకరణ కేంద్రాలు, స్లాట్ బుకింగ్, చెల్లింపులు మరియు పత్ర ధృవీకరణలో సహాయం చేయగలను. క్రింది ఎంపికను ఎంచుకోండి.", quick: [
    { label: "సమీప కేంద్రం", answer: "మీ స్థానాన్ని ఉపయోగించి ధృవీకరించిన కేంద్రాలను పోల్చి గూగుల్ మ్యాప్స్ దిశలు పొందడానికి సమీప కేంద్రాలను తెరవండి." },
    { label: "నా చెల్లింపు", answer: "PFMS చెల్లింపు స్థితి మరియు UTR చూడటానికి అమ్మకాల చరిత్ర లేదా బిల్లులు తెరవండి." },
    { label: "పత్ర సహాయం", answer: "KYC, డిజిలాకర్ ధృవీకరణ మరియు అనుసంధాన పత్రాలను చూడటానికి ప్రొఫైల్ తెరవండి." },
  ] },
  mr: { greeting: "आज मी तुम्हाला कशी मदत करू?", prompt: "केंद्र, स्लॉट, पेमेंट किंवा कागदपत्रांबद्दल विचारा", ask: "विचारा", listen: "बोला", listening: "ऐकत आहे…", fallback: "मी जवळची खरेदी केंद्रे, स्लॉट बुकिंग, पेमेंट आणि कागदपत्र पडताळणीस मदत करू शकतो. खालील पर्याय निवडा.", quick: [
    { label: "जवळचे केंद्र", answer: "स्थान वापरून सत्यापित केंद्रांची तुलना आणि गुगल मॅप दिशा मिळवण्यासाठी जवळची केंद्रे उघडा." },
    { label: "माझे पेमेंट", answer: "PFMS पेमेंट स्थिती आणि UTR पाहण्यासाठी विक्री इतिहास किंवा बिले उघडा." },
    { label: "कागदपत्र मदत", answer: "KYC, डिजिलॉकर पडताळणी आणि जोडलेली कागदपत्रे पाहण्यासाठी प्रोफाइल उघडा." },
  ] },
  gu: { greeting: "આજે હું તમને કેવી રીતે મદદ કરી શકું?", prompt: "કેન્દ્ર, સ્લોટ, ચુકવણી અથવા દસ્તાવેજ વિશે પૂછો", ask: "પૂછો", listen: "બોલો", listening: "સાંભળી રહ્યું છે…", fallback: "હું નજીકના ખરીદ કેન્દ્રો, સ્લોટ બુકિંગ, ચુકવણી અને દસ્તાવેજ ચકાસણીમાં મદદ કરી શકું છું. નીચે વિકલ્પ પસંદ કરો.", quick: [
    { label: "નજીકનું કેન્દ્ર", answer: "તમારા સ્થાનથી ચકાસાયેલ કેન્દ્રોની તુલના અને ગૂગલ મેપ દિશા મેળવવા નજીકના કેન્દ્રો ખોલો." },
    { label: "મારી ચુકવણી", answer: "PFMS ચુકવણી સ્થિતિ અને UTR જોવા વેચાણ ઇતિહાસ અથવા બિલ ખોલો." },
    { label: "દસ્તાવેજ મદદ", answer: "KYC, ડિજિલૉકર ચકાસણી અને જોડાયેલા દસ્તાવેજો જોવા પ્રોફાઇલ ખોલો." },
  ] },
  pa: { greeting: "ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?", prompt: "ਕੇਂਦਰ, ਸਲਾਟ, ਭੁਗਤਾਨ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਬਾਰੇ ਪੁੱਛੋ", ask: "ਪੁੱਛੋ", listen: "ਬੋਲੋ", listening: "ਸੁਣ ਰਿਹਾ ਹੈ…", fallback: "ਮੈਂ ਨੇੜਲੇ ਖਰੀਦ ਕੇਂਦਰਾਂ, ਸਲਾਟ ਬੁਕਿੰਗ, ਭੁਗਤਾਨ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਹੇਠਾਂ ਵਿਕਲਪ ਚੁਣੋ।", quick: [
    { label: "ਨੇੜਲਾ ਕੇਂਦਰ", answer: "ਆਪਣੀ ਥਾਂ ਨਾਲ ਤਸਦੀਕ ਕੇਂਦਰਾਂ ਦੀ ਤੁਲਨਾ ਅਤੇ ਗੂਗਲ ਮੈਪ ਦਿਸ਼ਾ ਲਈ ਨੇੜਲੇ ਕੇਂਦਰ ਖੋਲ੍ਹੋ।" },
    { label: "ਮੇਰਾ ਭੁਗਤਾਨ", answer: "PFMS ਭੁਗਤਾਨ ਸਥਿਤੀ ਅਤੇ UTR ਲਈ ਵਿਕਰੀ ਇਤਿਹਾਸ ਜਾਂ ਬਿੱਲ ਖੋਲ੍ਹੋ।" },
    { label: "ਦਸਤਾਵੇਜ਼ ਮਦਦ", answer: "KYC, ਡਿਜੀਲਾਕਰ ਤਸਦੀਕ ਅਤੇ ਜੁੜੇ ਦਸਤਾਵੇਜ਼ਾਂ ਲਈ ਪ੍ਰੋਫਾਈਲ ਖੋਲ੍ਹੋ।" },
  ] },
  kn: { greeting: "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?", prompt: "ಕೇಂದ್ರ, ಸ್ಲಾಟ್, ಪಾವತಿ ಅಥವಾ ದಾಖಲೆ ಬಗ್ಗೆ ಕೇಳಿ", ask: "ಕೇಳಿ", listen: "ಮಾತನಾಡಿ", listening: "ಕೇಳುತ್ತಿದೆ…", fallback: "ಹತ್ತಿರದ ಖರೀದಿ ಕೇಂದ್ರಗಳು, ಸ್ಲಾಟ್ ಬುಕ್ಕಿಂಗ್, ಪಾವತಿ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು. ಕೆಳಗಿನ ಆಯ್ಕೆ ಆರಿಸಿ.", quick: [
    { label: "ಹತ್ತಿರದ ಕೇಂದ್ರ", answer: "ನಿಮ್ಮ ಸ್ಥಳದಿಂದ ಪರಿಶೀಲಿತ ಕೇಂದ್ರಗಳನ್ನು ಹೋಲಿಸಿ ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ದಿಕ್ಕು ಪಡೆಯಲು ಹತ್ತಿರದ ಕೇಂದ್ರಗಳನ್ನು ತೆರೆಯಿರಿ." },
    { label: "ನನ್ನ ಪಾವತಿ", answer: "PFMS ಪಾವತಿ ಸ್ಥಿತಿ ಮತ್ತು UTR ನೋಡಲು ಮಾರಾಟ ಇತಿಹಾಸ ಅಥವಾ ಬಿಲ್ ತೆರೆಯಿರಿ." },
    { label: "ದಾಖಲೆ ಸಹಾಯ", answer: "KYC, ಡಿಜಿಲಾಕರ್ ಪರಿಶೀಲನೆ ಮತ್ತು ಜೋಡಿಸಿದ ದಾಖಲೆಗಳಿಗೆ ಪ್ರೊಫೈಲ್ ತೆರೆಯಿರಿ." },
  ] },
  or: { greeting: "ଆଜି ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?", prompt: "କେନ୍ଦ୍ର, ସ୍ଲଟ୍, ପେମେଣ୍ଟ କିମ୍ବା ଦଲିଲ ବିଷୟରେ ପଚାରନ୍ତୁ", ask: "ପଚାରନ୍ତୁ", listen: "କୁହନ୍ତୁ", listening: "ଶୁଣୁଛି…", fallback: "ମୁଁ ନିକଟସ୍ଥ କ୍ରୟ କେନ୍ଦ୍ର, ସ୍ଲଟ୍ ବୁକିଂ, ପେମେଣ୍ଟ ଏବଂ ଦଲିଲ ଯାଞ୍ଚରେ ସାହାଯ୍ୟ କରିପାରିବି। ତଳେ ବିକଳ୍ପ ବାଛନ୍ତୁ।", quick: [
    { label: "ନିକଟସ୍ଥ କେନ୍ଦ୍ର", answer: "ଆପଣଙ୍କ ସ୍ଥାନରୁ କେନ୍ଦ୍ର ତୁଳନା ଏବଂ ଗୁଗୁଲ୍ ମ୍ୟାପ୍ ଦିଗ ପାଇଁ ନିକଟସ୍ଥ କେନ୍ଦ୍ର ଖୋଲନ୍ତୁ।" },
    { label: "ମୋ ପେମେଣ୍ଟ", answer: "PFMS ପେମେଣ୍ଟ ସ୍ଥିତି ଏବଂ UTR ଦେଖିବାକୁ ବିକ୍ରୟ ଇତିହାସ କିମ୍ବା ବିଲ୍ ଖୋଲନ୍ତୁ।" },
    { label: "ଦଲିଲ ସହାୟତା", answer: "KYC, ଡିଜିଲକର୍ ଯାଞ୍ଚ ଏବଂ ସଂଯୁକ୍ତ ଦଲିଲ ପାଇଁ ପ୍ରୋଫାଇଲ୍ ଖୋଲନ୍ତୁ।" },
  ] },
  ml: { greeting: "ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?", prompt: "കേന്ദ്രം, സ്ലോട്ട്, പണമടവ് അല്ലെങ്കിൽ രേഖകളെക്കുറിച്ച് ചോദിക്കുക", ask: "ചോദിക്കുക", listen: "സംസാരിക്കുക", listening: "കേൾക്കുന്നു…", fallback: "അടുത്ത സംഭരണ കേന്ദ്രങ്ങൾ, സ്ലോട്ട് ബുക്കിങ്, പണമടവ്, രേഖ പരിശോധന എന്നിവയിൽ സഹായിക്കാം. താഴെ ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.", quick: [
    { label: "അടുത്ത കേന്ദ്രം", answer: "നിങ്ങളുടെ സ്ഥാനം ഉപയോഗിച്ച് കേന്ദ്രങ്ങൾ താരതമ്യം ചെയ്യാനും ഗൂഗിൾ മാപ്സ് വഴി നേടാനും അടുത്ത കേന്ദ്രങ്ങൾ തുറക്കുക." },
    { label: "എന്റെ പണമടവ്", answer: "PFMS നിലയും UTR നമ്പറും കാണാൻ വിൽപ്പന ചരിത്രം അല്ലെങ്കിൽ ബില്ലുകൾ തുറക്കുക." },
    { label: "രേഖ സഹായം", answer: "KYC, ഡിജിലോക്കർ പരിശോധന, ബന്ധിപ്പിച്ച രേഖകൾ എന്നിവ കാണാൻ പ്രൊഫൈൽ തുറക്കുക." },
  ] },
};

interface RecognitionResultEvent {
  results: ArrayLike<{ 0: { transcript: string } }>;
}

interface BrowserRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type RecognitionConstructor = new () => BrowserRecognition;

export default function BhashiniAssistant({ role }: Props) {
  const { lang } = useAuth();
  const copy = COPY[lang];
  const { speak, stop, status, provider, error } = useBhashiniVoice(lang);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(copy.greeting);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<BrowserRecognition | null>(null);

  async function answerQuestion(text: string, fallback = copy.fallback) {
    if (!text.trim()) return;
    setQuestion(text);
    let responseText = fallback;
    try {
      responseText = await askBhashini(text, lang, role) ?? fallback;
    } catch {
      responseText = fallback;
    }
    setAnswer(responseText);
    void speak(responseText);
  }

  function startListening() {
    const voiceWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setAnswer(copy.fallback);
      void speak(copy.fallback);
      return;
    }
    stop();
    const recognition = new Recognition();
    recognition.lang = BHASHINI_LANGUAGE[lang].locale;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      void answerQuestion(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function closeAssistant() {
    recognitionRef.current?.stop();
    stop();
    setListening(false);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[8000]">
      {open && (
        <div className="mb-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          <div className="bg-chakra-blue p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Bhashini AI</div>
                <div className="mt-1 font-display text-xl font-bold">{BHASHINI_LANGUAGE[lang].native}</div>
                <div className="mt-1 text-xs text-white/60">{copy.greeting}</div>
              </div>
              <button type="button" onClick={closeAssistant} className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white" aria-label="Close voice assistant">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="rounded-2xl bg-info-bg p-4 text-sm leading-relaxed text-gray-700">{answer}</div>
            <div className="flex flex-wrap gap-2">
              {copy.quick.map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => void answerQuestion(item.label, item.answer)}
                  className="rounded-full border border-orange-100 bg-gov-bg px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-saffron hover:text-saffron"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={question}
                onChange={event => setQuestion(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") void answerQuestion(question);
                }}
                placeholder={copy.prompt}
                className="min-w-0 flex-1 rounded-xl border-2 border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-saffron"
              />
              <button type="button" onClick={() => void answerQuestion(question)} className="rounded-xl bg-chakra-blue px-4 text-sm font-bold text-white hover:bg-navy-dark">
                {copy.ask}
              </button>
            </div>
            <button
              type="button"
              onClick={listening ? () => recognitionRef.current?.stop() : startListening}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-colors ${
                listening ? "bg-danger" : "bg-india-green hover:bg-india-green-light"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
              </svg>
              {listening ? copy.listening : copy.listen}
            </button>
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>{status === "speaking" ? "Voice response active" : error || "11-language voice ready"}</span>
              <span>{provider === "bhashini" ? "Bhashini Cloud" : provider === "device" ? "Secure device voice" : BHASHINI_LANGUAGE[lang].locale}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (open) closeAssistant();
          else setOpen(true);
        }}
        className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-chakra-blue text-white shadow-2xl transition-transform hover:scale-105"
        aria-label="Open Bhashini voice assistant"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2v-5Z" />
          <path d="M9 21h6" />
        </svg>
      </button>
    </div>
  );
}
