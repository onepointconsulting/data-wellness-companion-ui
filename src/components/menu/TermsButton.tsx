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
      func={() =>
        window.open(
          "./terms/Terms_of_Use_for_Onepoint_D-Well_v1.0.pdf",
          "_blank",
        )
      }
    >
      <InfoImage />
    </MenuItemTemplate>
  );
}
