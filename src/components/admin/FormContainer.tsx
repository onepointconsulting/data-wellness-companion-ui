export default function FormContainer({
  children,
  onReset,
  onSubmit,
  disabled,
  hasReset = true,
  extraButtons,
}: {
  children: React.ReactNode;
  onReset: () => void;
  onSubmit: (e: React.MouseEvent<HTMLInputElement>) => void;
  disabled: boolean;
  hasReset: boolean;
  extraButtons?: React.ReactNode;
}) {
  return (
    <form className="mt-8">
      {children}
      <div className="flex flex-wrap justify-end mt-8">
        {hasReset && (
          <input
            type="reset"
            onClick={onReset}
            className="px-6 py-3 mr-2 text-white bg-destructive hover:bg-red-600 disabled:bg-red-200 dark:disabled:bg-red-400"
            disabled={disabled}
          />
        )}
        <div className="flex flex-wrap gap-4 lg:flex-row">
          {extraButtons}
          <input
            type="submit"
            onClick={onSubmit}
            className="px-6 py-3 text-white bg-blue-500 disabled:bg-blue-200 hover:bg-blue-700 dark:disabled:bg-blue-400 dark:hover:bg-blue-400"
            disabled={disabled}
          />
        </div>
      </div>
    </form>
  );
}
