export default function handleSubmission(func: () => void) {
  return (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.info("Submitting form.");
    func();
  };
}
