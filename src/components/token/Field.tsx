import {useTranslation} from "react-i18next";
import {ReactNode} from "react";


export default function Field({label, children}: {label: string, children: ReactNode}) {
    const [t] = useTranslation();
    return <div className="flex flex-wrap mt-8">
        <div className="w-2/12 text-right pr-2 mt-2 dark:text-gray-100">
            {t(label)}:
        </div>
        <div className="w-10/12">
            {children}
        </div>
    </div>
}