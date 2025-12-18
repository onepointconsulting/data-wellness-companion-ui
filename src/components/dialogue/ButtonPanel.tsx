export default function ButtonPanel({
  onOk,
  okText,
  disabled = false,
}: {
  onOk: () => void;
  okText: string;
  disabled: boolean;
}) {
  return (
    <div className="companion-dialogue-buttons flex flex-row justify-end gap-4 px-6 pt-4 pb-8">
      <button
        disabled={disabled}
        data-close-modal={true}
        onClick={onOk}
        className="button-ok cursor-pointer hover:scale-101 transition duration-300  ease-in-out disabled:opacity-50 disabled:cursor-not-allowed border border-solid border-[#9A19FF] dark:border-[#fafffe] px-4 py-2 text-base font-medium text-[#9A19FF] dark:text-[#fafffe] focus:ring-4 focus:outline-none focus:ring-[#9A19FF33] rounded-lg text-center"
      >
        {okText}
      </button>
    </div>
  );
}
