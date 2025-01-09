import { IntroContext, IntroSlide } from "./IntroContext.tsx";
import { useContext } from "react";
import "./intro.css";
import VideoIframe from "./VideoIFrame.tsx";
import Progress from "./Progress.tsx";
import { useTranslation } from "react-i18next";
import { setAutoStart, setTourFinished } from "../../lib/joyrideFunctions.ts";

export function IntroSlides({
  showIntro,
  setSeenIntro,
  imageNode,
  closeIcon,
  slides,
}: {
  showIntro: boolean;
  setSeenIntro: (b: boolean) => void;
  imageNode: React.ReactNode;
  closeIcon: React.ReactNode;
  slides: IntroSlide[] | null;
}) {
  const [t] = useTranslation();
  const { currentSlide, setCurrentSlide } = useContext(IntroContext);
  if (slides == null || slides.length < 1) {
    return null;
  }

  const slide = slides[currentSlide];
  const subTitle = slide.subtitle;

  return (
    <section className={`intro-slides ${showIntro ? "" : "hidden"}`}>
      <section className="intro-main-container">
        {/* Header */}
        <section className="intro-header">
          <div className="intro-header-image">{imageNode}</div>
          {currentSlide === slides.length - 1 && (
            <div
              className="intro-header-close"
              onClick={() => setSeenIntro(true)}
            >
              {closeIcon}
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
                {currentSlide === slides.length - 2 && (
                  <button
                    className="border-button intro-button"
                    onClick={() => {
                      setAutoStart(true);
                      setSeenIntro(true);
                    }}
                  >
                    {t("Take the tour")}
                  </button>
                )}
                {currentSlide === slides.length - 1 && (
                  <button
                    className="border-button intro-button"
                    onClick={() => {
                      setSeenIntro(true);
                      setTourFinished();
                    }}
                  >
                    {t("Generate report")}
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
          <Progress
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </div>
      </section>
    </section>
  );
}
