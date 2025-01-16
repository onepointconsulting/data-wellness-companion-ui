import { IntroSlide } from "./IntroContext.tsx";
import ProgressButton from "./ProgressButton.tsx";

export default function Progress({
  slides,
  currentSlide,
  setCurrentSlide,
}: {
  slides: IntroSlide[];
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
}) {
  function onPrevious() {
    setCurrentSlide(Math.max(0, currentSlide - 1));
  }

  function onNext() {
    setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1));
  }

  return (
    <div className="flex flex-row items-end mt-12">
      <ProgressButton
        handlerFunc={onPrevious}
        translationKey={"Previous"}
        imgPath={"./tour/triangle-left.svg"}
        disabled={currentSlide === 0}
      />
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
      <ProgressButton
        handlerFunc={onNext}
        translationKey={"Next"}
        imgPath={"./tour/triangle-right.svg"}
        disabled={currentSlide === slides.length - 1}
      />
    </div>
  );
}
