import {IntroContext, IntroSlide} from "./IntroContext.tsx";
import {useContext} from "react";
import "./intro.css";

export function IntroSlides({showIntro, setSeenIntro, imageNode, closeIcon, slides}: {
  showIntro: boolean,
  setSeenIntro: (b: boolean) => void,
  imageNode: React.ReactNode,
  closeIcon: React.ReactNode,
  slides: IntroSlide[] | null
}) {
  const {currentSlide, setCurrentSlide} = useContext(IntroContext);
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

  console.log('currentSlide', currentSlide)

  const slide = slides[currentSlide];
  return (
    <section className={`intro-slides ${showIntro ? '' : 'hidden'}`}>
      <section className="intro-main-container">
        <section className="intro-header">
          <div className="intro-header-image">{imageNode}</div>
          <div className="intro-header-close" onClick={() => setSeenIntro(true)}>{closeIcon}</div>
        </section>
        <section className="intro-body">
          <div className="intro-body-left">
            <div>
              <h1>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <div className="explanation">{slide.explanation}</div>
            </div>
          </div>
          <div className="intro-body-right">
            <div className="gray-back"></div>
            {slide.image && <img src={slide.image} alt="D-Well app"/>}
          </div>
        </section>
        <div className="progress">
          {slides.map((_, index) => {
            const visited = index < currentSlide;
            return <div key={`intro-slide-${index}`}
                        className={`progress-item ${index === currentSlide ? 'hightlighted' : ''} ${visited ? 'visited' : ''}`}
                        onClick={() => visited && setCurrentSlide(index)}
            ></div>
          })}
        </div>
        <section className="intro-footer">
          <button className="intro-next" onClick={onNext}>
            <div>Next</div>
            <div>&#x2192;</div>
          </button>
          <div className="intro-next-extras"><a href="#">Watch tutorial video</a></div>
        </section>
      </section>
    </section>
  )
}