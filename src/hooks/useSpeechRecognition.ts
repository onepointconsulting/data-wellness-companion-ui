import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const isSecureContext =
  window.location.href.startsWith("https://") ||
  window.location.href.includes("localhost") ||
  window.location.href.includes("127.0.0.1");

const recognition =
  SpeechRecognition && isSecureContext ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.lang = "en-GB";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

export default function useSpeechRecognition() {
  const { voiceOn, setVoiceOn, setVoiceListening, voiceListening } =
    useAppStore(useShallow((state) => ({ ...state })));
  const { messages, sending, setChatText } = useContext(AppContext);

  function stop() {
    try {
      setVoiceListening(false);
      recognition?.stop();
    } catch (e) {
      console.error(`Failed to stop ${e}`);
    }
  }

  useEffect(() => {
    if (voiceOn) {
      try {
        recognition?.start();
      } catch (e) {
        console.error(`Failed to stop ${e}`);
      }
    } else {
      stop();
    }
    return () => {
      stop();
    };
  }, [voiceOn]);

  useEffect(() => {
    setVoiceOn(false);
    setChatText("");
    setVoiceListening(false);
  }, [messages, sending]);

  function onToggleVoice(e: React.MouseEvent<HTMLButtonElement>) {
    if (recognition) {
      e.preventDefault();
      setVoiceOn(!voiceOn);
    }
  }

  function deactivateVoice() {
    if (recognition) {
      if (voiceOn) {
        setVoiceOn(!voiceOn);
      }
    }
  }

  if (recognition) {
    recognition.onspeechstart = () => {
      setVoiceListening(true);
    };
    recognition.onspeechend = () => {
      setVoiceListening(false);
    };
    recognition.onresult = (event) => {
      let newText = "";
      for (const resultList of event.results) {
        for (const word of resultList) {
          newText += word.transcript;
        }
      }
      setChatText(newText);
    };
  }

  return {
    onToggleVoice,
    deactivateVoice,
    voiceOn,
    hasSpeechRecognition: !!recognition,
    voiceListening,
  };
}
