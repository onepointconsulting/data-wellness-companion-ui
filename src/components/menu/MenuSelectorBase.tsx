/**
 * Base component for menu items with select elements.
 * This component renders a menu item consisting of an image and a select (drop-down) element.
 * It is designed to be a flexible base component that can be used in various parts of the application where
 * such a layout is required.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.image - The image element to be displayed in the menu item.
 * @param {React.ReactNode} props.select - The select (drop-down) element to be displayed alongside the image.
 *
 * @returns {JSX.Element} The rendered JSX element representing the menu item.
 *
 * @example
 * <MenuSelectorBase
 *   image={<img src="path/to/image.jpg" alt="Menu Item" />}
 *   select={
 *     <select>
 *       <option value="1">Option 1</option>
 *       <option value="2">Option 2</option>
 *     </select>
 *   }
 * />
 *
 * This would render a menu item with an image on the left and a select element on the right.
 *
 * @constructor
 */
export default function MenuSelectorBase({
  image,
  select,
}: {
  image: React.ReactNode;
  select: React.ReactNode;
}) {
  return (
    <div className="menu-item">
      <div className="w-12">{image}</div>
      <div className="pl-2 flex-grow pr-6">{select}</div>
    </div>
  );
}
