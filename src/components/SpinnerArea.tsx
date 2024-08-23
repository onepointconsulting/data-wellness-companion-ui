import Spinner from "./Spinner.tsx";
import ErrorMessage from "./message/ErrorMessage.tsx";

export default function SpinnerArea({
  sending,
  errorMessage,
}: {
  sending: boolean;
  errorMessage: string | undefined;
}) {
  return (
    <>
      {sending && (
        <>
          <div className="mt-6 mb-8">
            <Spinner />
          </div>
        </>
      )}
      {!!errorMessage && <ErrorMessage error={errorMessage} />}
    </>
  );
}
