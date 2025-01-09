import { createContext, useState } from "react";
import { Props } from "../../context/commonModel.ts";

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
  introSlides: IntroSlide[];
  setIntroSlides: (slides: IntroSlide[]) => void;
}

function createIntroState(): IntroState {
  return {
    currentSlide: 0,
    setCurrentSlide: () => {},
    introSlides: [],
    setIntroSlides: () => {},
  };
}

export const IntroContext = createContext<IntroState>(createIntroState());

export const IntroContextProvider = ({ children }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [introSlides, setIntroSlides] = useState<IntroSlide[]>([]);

  return (
    <IntroContext.Provider
      value={{ currentSlide, setCurrentSlide, introSlides, setIntroSlides }}
    >
      {children}
    </IntroContext.Provider>
  );
};
