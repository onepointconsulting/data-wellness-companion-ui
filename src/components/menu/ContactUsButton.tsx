import MenuItemTemplate from "./MenuItemTemplate.tsx";

/**
 * Simple contact us button used to open a contact us form.
 * @constructor
 */
export default function ContactUsButton() {
  return (
    <MenuItemTemplate
      title="Contact us"
      func={() => window.open("https://onepointltd.com", "_blank")}
    >
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_801_1009)">
          <path d="M20.1395 0.242337C19.3173 -0.232431 18.2623 0.0503379 17.7877 0.872517L15.441 4.93706H10.3803C10.1537 4.93706 9.97009 5.12074 9.97009 5.34723C9.97009 5.57372 10.1537 5.7574 10.3803 5.7574H14.9674L13.2645 8.70699H3.69158C3.46505 8.70699 3.28142 8.89066 3.28142 9.11715C3.28142 9.34369 3.46505 9.52732 3.69158 9.52732H12.7908L11.8436 11.168H3.69158C3.46505 11.168 3.28142 11.3517 3.28142 11.5782C3.28142 11.8046 3.46505 11.9883 3.69158 11.9883H11.6739L11.4972 13.629H3.69158C3.46505 13.629 3.28142 13.8127 3.28142 14.0392C3.28142 14.2656 3.46505 14.4493 3.69158 14.4493H11.4088L11.387 14.6519C11.3696 14.8133 11.4491 14.9699 11.5897 15.051C11.6534 15.0878 11.7241 15.106 11.7947 15.106C11.88 15.106 11.965 15.0795 12.0367 15.027L14.6557 13.1138C14.7018 13.0801 14.7404 13.0372 14.7689 12.9877L17.9653 7.45147V15.4016C17.9653 16.3206 17.2176 17.0684 16.2985 17.0684H6.79289C6.64634 17.0684 6.51094 17.1465 6.43769 17.2734L5.00346 19.7576L3.56923 17.2734C3.49597 17.1465 3.36058 17.0684 3.21403 17.0684H2.48709C1.56803 17.0684 0.820333 16.3206 0.820333 15.4016V7.42415C0.820333 6.50513 1.56803 5.7574 2.48709 5.7574H6.68879C6.91533 5.7574 7.09896 5.57372 7.09896 5.34723C7.09896 5.1207 6.91533 4.93706 6.68879 4.93706H2.48709C1.11569 4.93706 0 6.05276 0 7.42415V15.4016C0 16.773 1.11569 17.8887 2.48709 17.8887H2.97719L4.64825 20.783C4.72151 20.9099 4.85691 20.9881 5.00346 20.9881C5.15001 20.9881 5.28541 20.9099 5.35866 20.783L7.02972 17.8887H16.2986C17.67 17.8887 18.7857 16.773 18.7857 15.4016V7.42415C18.7857 7.07256 18.7111 6.72523 18.5685 6.40677L20.7697 2.59419C21.2443 1.77205 20.9616 0.717023 20.1395 0.242337ZM19.7293 0.952746C20.1597 1.20127 20.3077 1.7536 20.0592 2.18403L19.8248 2.58997L18.2637 1.68863L18.4981 1.28268C18.7466 0.852296 19.2989 0.704349 19.7293 0.952746ZM12.4825 12.1412L13.6632 12.8229L12.302 13.8174L12.4825 12.1412ZM14.2636 12.2223L12.7025 11.321L17.8535 2.39903L19.4147 3.30038L14.2636 12.2223Z" fill="#4A4A4A"/>
          <path d="M8.53432 5.75732C8.64219 5.75732 8.74801 5.71344 8.82471 5.63715C8.901 5.56086 8.94489 5.45504 8.94489 5.34717C8.94489 5.2393 8.901 5.13348 8.82471 5.05719C8.74801 4.98094 8.6426 4.93701 8.53432 4.93701C8.42645 4.93701 8.32063 4.9809 8.24434 5.05719C8.16805 5.13348 8.12457 5.2393 8.12457 5.34717C8.12457 5.45504 8.16801 5.56086 8.24434 5.63715C8.32104 5.71344 8.42645 5.75732 8.53432 5.75732Z" fill="#4A4A4A"/>
        </g>
        <defs>
          <clipPath id="clip0_801_1009">
            <rect width="21" height="21" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </MenuItemTemplate>
  );
}
