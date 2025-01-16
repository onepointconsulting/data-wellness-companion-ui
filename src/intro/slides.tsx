import i18next from "../i18n/i18n.tsx";
import { setAutoStart } from "../lib/joyrideFunctions.ts";
import { IntroSlide } from "../components/intro/IntroContext.tsx";

const { t } = i18next;

export function getIntroSlides() {
  return [
    {
      title: t("Welcome"),
      subtitle: t("empty"),
      explanation: t("intro-welcome"),
      image: null,
      video: "q7slV210RqQ",
      buttonText: null,
      buttonOnclick: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 1 }),
      explanation: t("intro-explanation-1"),
      image: "./tour/slide1.png",
      video: null,
      buttonText: null,
      buttonOnclick: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 2 }),
      explanation: t("intro-explanation-2"),
      image: "./tour/slide2.png",
      video: null,
      buttonText: null,
      buttonOnclick: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 3 }),
      explanation: t("intro-explanation-3"),
      image: "./screenshots/d-well-screenshot-3.png",
      video: null,
      buttonText: null,
      buttonOnclick: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 4 }),
      explanation: t("intro-explanation-4"),
      image: "./tour/slide3.png",
      video: null,
      buttonText: null,
      buttonOnclick: null,
    },
    {
      title: t("intro-how-to-use"),
      subtitle: t("intro-step", { step: 5 }),
      explanation: t("intro-explanation-5"),
      image: "./screenshots/d-well-screenshot-5.png",
      video: null,
      buttonText: "Take the tour",
      buttonOnclick: () => setAutoStart(true),
    },
  ];
}

export function getCompletionSlides(giveMeReportNow: () => void): IntroSlide[] {
  return [
    {
      title: t("Thank you"),
      subtitle: t("empty"),
      explanation: t("intro-thank-you"),
      image: "./tour/slide3.png",
      video: null,
      buttonText: "Generate report",
      buttonOnclick: () => giveMeReportNow(),
    },
  ];
}
