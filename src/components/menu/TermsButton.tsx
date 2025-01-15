import MenuItemTemplate from "./MenuItemTemplate.tsx";
import InfoImage from "./InfoImage.tsx";

/**
 * Simple contact us button used to open a contact us form.
 * @constructor
 */
export default function TermsButton() {
  return (
    <MenuItemTemplate
      title="Terms"
      func={() => window.open("https://www.onepointltd.com/wp-content/uploads/2025/01/Terms-of-Use-for-Onepoint-D-Well-v2.0.pdf", "_blank")}
    >
      <InfoImage />
    </MenuItemTemplate>
  );
}
