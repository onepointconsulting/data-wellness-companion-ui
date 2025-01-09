import i18next from "../i18n/i18n.tsx";
import { IntroSlide } from "../components/intro/IntroContext.tsx";

const { t } = i18next;

export function getClustreSlides(): IntroSlide[] {
  return [
    {
      title: t("Welcome"),
      subtitle: t("empty"),
      explanation: t("Clustre: intro-welcome"),
      image: "./tour/slide1.png",
      video: null,
    },
    {
      title: t("Clustre: nutshell"),
      subtitle: t("empty"),
      explanation: t("Clustre: intro-nutshell"),
      image: "./tour/slide2.png",
      video: null,
    },
    {
      title: t("Clustre: optional-goodies"),
      subtitle: t("empty"),
      explanation: t("Clustre: intro-optional-goodies"),
      image: "./tour/slide3.png",
      video: null,
    },
  ];
}

export function getClustreCompletionSlides(): IntroSlide[] {
  return [
    {
      title: t("Clustre: thank you"),
      subtitle: t("empty"),
      explanation: t("Clustre: intro-thank-you"),
      image: "./tour/slide3.png",
      video: null,
    },
  ];
}

export default function getIntroSlides(): IntroSlide[] {
  return [
    {
      title: t("Welcome"),
      subtitle: t("empty"),
      explanation: t("intro-welcome"),
      image: null,
      video: "q7slV210RqQ",
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 1 }),
      explanation: t("intro-explanation-1"),
      image: "./screenshots/d-well-screenshot-1.png",
      video: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 2 }),
      explanation: t("intro-explanation-2"),
      image: "./screenshots/d-well-screenshot-2.png",
      video: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 3 }),
      explanation: t("intro-explanation-3"),
      image: "./screenshots/d-well-screenshot-3.png",
      video: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 4 }),
      explanation: t("intro-explanation-4"),
      image: "./screenshots/d-well-screenshot-4.png",
      video: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 5 }),
      explanation: t("intro-explanation-5"),
      image: "./screenshots/d-well-screenshot-5.png",
      video: null,
    },
  ];
}
