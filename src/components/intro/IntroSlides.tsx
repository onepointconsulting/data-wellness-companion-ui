import { IntroContext, IntroSlide } from "./IntroContext.tsx";
import { useContext, useEffect } from "react";
import "./intro.css";
import VideoIframe from "./VideoIFrame.tsx";
import Progress from "./Progress.tsx";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";

function CloseButton({ closeFunction }: { closeFunction: () => void }) {
  const { currentSlide, introSlides } = useContext(IntroContext);
  if (currentSlide === introSlides.length - 1) {
    return (
      <div className="intro-header-close" onClick={() => closeFunction()}>
        <IoMdClose className="w-10 h-10 lg:w-16 lg:h-16" />
      </div>
    );
  } else {
    return null;
  }
}

export function IntroSlides({
  showIntro,
  imageNode,
  slides,
  closeFunction,
    hasCloseButton = true
}: {
  showIntro: boolean;
  imageNode: React.ReactNode;
  slides: IntroSlide[] | null;
  closeFunction: () => void;
  hasCloseButton: boolean
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
          {hasCloseButton && <CloseButton closeFunction={closeFunction}/>}
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

                {slide.buttonText && (
                  <button
                    className="border-button intro-button"
                    onClick={() => {
                      if (slide.buttonOnclick) {
                        slide.buttonOnclick();
                      }
                      closeFunction();
                    }}
                  >
                    {t(slide.buttonText)}
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
