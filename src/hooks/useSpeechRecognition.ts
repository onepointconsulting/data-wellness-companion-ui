import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.tsx";

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
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
}

export default function useSpeechRecognition() {
  const [voiceOn, setVoiceOn] = useState(false)
  const [voiceListening, setVoiceListening] = useState(false)
  const { messages, sending, setChatText } = useContext(AppContext);
  console.log('useSpeechRecognition')

  function stop() {
    try {
      setVoiceListening(false);
      setVoiceOn(false)
      recognition?.stop();
    } catch (e) {
      console.error(`Failed to stop ${e}`);
    }
  }

  useEffect(() => {
    stop()
  }, [messages, sending]);

  function onToggleVoice(e: React.MouseEvent<HTMLButtonElement>) {
    if (recognition) {
      e.preventDefault();
      setVoiceOn(!voiceOn);
      if(voiceOn) {
        stop()
      } else {
        recognition.start()
      }
    }
  }

  function deactivateVoice() {
    if (recognition) {
      stop()
    }
  }

  if (recognition) {
    recognition.onaudiostart = () => {
      setVoiceOn(true);
    };
    recognition.onaudioend = () => {
      setVoiceOn(false);
    };
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
