import { scrollTop } from "./scrollFunctions.ts";

export default function handleSubmission(
  func: () => void,
  doScrollTop: boolean = false,
) {
  return (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    func();
    if (doScrollTop) {
      setTimeout(() => scrollTop(), 1000);
    }
  };
}
