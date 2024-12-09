export default function FormContainer({
  children,
  onReset,
  onSubmit,
  isDisabled,
}: {
  children: React.ReactNode;
  onReset: () => void;
  onSubmit: (e: React.MouseEvent<HTMLInputElement>) => void;
  isDisabled: () => boolean;
}) {
  return (
    <form className="mt-8">
      {children}
      <div className="flex flex-wrap mt-8 justify-end">
        <input
          type="reset"
          onClick={onReset}
          className="bg-destructive px-6 py-3 text-white hover:bg-red-600 mr-2 disabled:bg-red-200 dark:disabled:bg-red-400"
          disabled={isDisabled()}
        />
        <input
          type="submit"
          onClick={onSubmit}
          className="bg-blue-500 disabled:bg-blue-200 px-6 py-3 text-white hover:bg-blue-700 dark:disabled:bg-blue-400 dark:hover:bg-blue-400"
          disabled={isDisabled()}
        />
      </div>
    </form>
  );
}
