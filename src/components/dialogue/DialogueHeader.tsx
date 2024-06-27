import {IoCloseOutline} from "react-icons/io5";

/**
 * Used for dialogue headers.
 * @param children
 * @param onClose
 * @constructor
 */
export default function DialogueHeader({children, onClose}: {children: React.ReactNode; onClose: () => void}) {
  return (
    <section className="flex flex-row justify-between pl-3 pr-1">
      {children}
      <IoCloseOutline className="close-icon" onClick={onClose}/>
    </section>
  )
}