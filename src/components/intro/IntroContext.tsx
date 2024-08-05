import {createContext, useState} from "react";
import {Props} from "../../context/commonModel.ts";

export interface IntroSlide {
  title: string;
  subtitle: string;
  explanation: string;
  image: string | null;
  video: string | null;
}

interface IntroState {
  currentSlide: number;
  setCurrentSlide: (currentSlide: number) => void;
}

function createIntroState(): IntroState {
  return {
    currentSlide: 0,
    setCurrentSlide: () => {},
  };
}

export const IntroContext = createContext<IntroState>(createIntroState());

export const IntroContextProvider = ({ children }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return <IntroContext.Provider value={{ currentSlide, setCurrentSlide }}>{children}</IntroContext.Provider>;
}

