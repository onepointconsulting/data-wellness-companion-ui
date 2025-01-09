import { IntroContext, IntroSlide } from "./IntroContext.tsx";
import { useContext, useEffect } from "react";
import "./intro.css";
import VideoIframe from "./VideoIFrame.tsx";
import Progress from "./Progress.tsx";
import { useTranslation } from "react-i18next";
import { setAutoStart } from "../../lib/joyrideFunctions.ts";
import { IoMdClose } from "react-icons/io";

export function IntroSlides({
  showIntro,
  imageNode,
  slides,
  lastButtonText,
  closeFunction,
}: {
  showIntro: boolean;
  imageNode: React.ReactNode;
  slides: IntroSlide[] | null;
  lastButtonText: string;
  closeFunction: () => void;
}) {
  const [t] = useTranslation();
  const { currentSlide, setCurrentSlide, introSlides, setIntroSlides } =
    useContext(IntroContext);
  useEffect(() => {
    if (slides) {
      setCurrentSlide(0);
      setIntroSlides(slides);
    }
  }, [slides, setIntroSlides]);
  if (introSlides == null || introSlides.length < 1) {
    return null;
  }

  const slide = introSlides[currentSlide];
  const subTitle = slide.subtitle;

  return (
    <section className={`intro-slides ${showIntro ? "" : "hidden"}`}>
      <section className="intro-main-container">
        {/* Header */}
        <section className="intro-header">
          <div className="intro-header-image">{imageNode}</div>
          {currentSlide === introSlides.length - 1 && (
            <div className="intro-header-close" onClick={() => closeFunction()}>
              <IoMdClose className="w-10 h-10 lg:w-16 lg:h-16" />
            </div>
          )}
        </section>

        <div className="intro-body-wrapper">
          {/* Body */}
          <section className="intro-body">
            {/* Left */}
            <div className="intro-body-left">
              <div className="flex flex-col items-start justify-start h-full gap-4 lg:pt-12 lg:gap-14">
                <h1>{slide.title}</h1>
                <div className="explanation">
                  {!!subTitle && <h2>{subTitle}</h2>}
                  <p dangerouslySetInnerHTML={{ __html: slide.explanation }} />
                </div>
                {/* Conditional buttons */}
                {currentSlide === introSlides.length - 2 && (
                  <button
                    className="border-button intro-button"
                    onClick={() => {
                      setAutoStart(true);
                      closeFunction();
                    }}
                  >
                    {t("Take the tour")}
                  </button>
                )}
                {currentSlide === introSlides.length - 1 && (
                  <button
                    className="border-button intro-button"
                    onClick={() => closeFunction()}
                  >
                    {t(lastButtonText)}
                  </button>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="intro-body-right">
              {!!slide.video && <VideoIframe videoUrl={slide.video} />}
              {slide.image && !slide.video && (
                <img src={slide.image ? slide.image : ""} alt="D-Well app" />
              )}
            </div>
          </section>

          {/* Progress */}
          {introSlides.length > 1 && (
            <Progress
              slides={introSlides}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
            />
          )}
        </div>
      </section>
    </section>
  );
}
