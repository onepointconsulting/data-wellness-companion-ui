/**
 * Template component for a most dialogues.
 * @param dialogueId The dialogue id.
 * @param clazz The CSS class.
 * @param content The main content.
 * @param buttons The buttons
 * @constructor
 */
export default function GenericDialogue({dialogueId, clazz, content, buttons}: {
  dialogueId: string,
  clazz: string,
  content: React.ReactNode,
  buttons: React.ReactNode
}) {
  return (
    <dialog
      data-model={true}
      id={dialogueId}
      className={clazz}
    >
      <div className="companion-dialogue-content">
        {content}
      </div>
      <div className="companion-dialogue-buttons">
        {buttons}
      </div>
    </dialog>
  )
}