import { IntroContext, IntroSlide } from "./IntroContext.tsx";
import { useContext } from "react";
import "./intro.css";
import VideoIframe from "./VideoIFrame.tsx";

function Progress({
  slides,
  currentSlide,
  setCurrentSlide,
}: {
  slides: IntroSlide[];
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
}) {
  return (
    <div className="progress">
      {slides.map((_, index) => {
        const visited = index < currentSlide;
        return (
          <div
            key={`intro-slide-${index}`}
            className={`progress-item ${index === currentSlide ? "hightlighted" : ""} ${visited ? "visited" : ""}`}
            onClick={() => visited && setCurrentSlide(index)}
          ></div>
        );
      })}
    </div>
  );
}

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
  const { currentSlide, setCurrentSlide } = useContext(IntroContext);
  if (slides == null || slides.length < 1) {
    return null;
  }

  function onNext() {
    if (!!slides) {
      if (currentSlide < slides.length - 1) {
        const newCurrentSlide = currentSlide + 1;
        setCurrentSlide(newCurrentSlide);
      } else {
        setSeenIntro(true);
      }
    }
  }

  function showVideo(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    setCurrentSlide(0);
  }

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;
  const subTitle = slide.subtitle;

  return (
    <section className={`intro-slides ${showIntro ? "" : "hidden"}`}>
      <section className="intro-main-container">
        {/* Header */}
        <section className="intro-header">
          <div className="intro-header-image">{imageNode}</div>
          <div
            className="intro-header-close"
            onClick={() => setSeenIntro(true)}
          >
            {closeIcon}
          </div>
        </section>

        <div className="flex flex-col min-h-screen pt-4 2xl:justify-center lg:pt-12 2xl:pt-0 2xl:-mt-16">
          {/* Body */}
          <section className="intro-body">
            {/* Left */}
            <div className="intro-body-left">
              <div className="flex flex-col items-start justify-start h-full gap-4 lg:pt-12 lg:gap-14">
                <h1>{slide.title}</h1>
                <div className="explanation">
                  {!!subTitle && <h2>{subTitle}</h2>}
                  <p>{slide.explanation}</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="intro-body-right">
              <div className="gray-back"></div>
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

          <div className="flex items-center">
            <section className="intro-footer">
              <button
                className={`intro-next ${isLast ? "!justify-center" : ""}`}
                onClick={onNext}
              >
                <div>{isLast ? "Get started" : "Next"}</div>
                {!isLast && <div>&#x2192;</div>}
              </button>

              {currentSlide > 0 && (
                <div className="intro-next-extras">
                  <a href="#" onClick={showVideo}>
                    Watch tutorial video
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </section>
  );
}
