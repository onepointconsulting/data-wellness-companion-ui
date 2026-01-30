

export default function RelevantButton({children, onClick}: {children: React.ReactNode, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#8F00FF] dark:bg-gray-800 dark:text-[#fafffe] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all duration-200"
        >
            {children}
        </button>
    );
}