import { showDialogue } from "../../lib/dialogFunctions.ts";
import { INFO_DIALOGUE_ID } from "../dialogue/InfoDialogue.tsx";
import MenuItemTemplate from "./MenuItemTemplate.tsx";

function showInfoDialogue() {
  showDialogue(INFO_DIALOGUE_ID);
}

export default function InfoButton() {
  return (
    <MenuItemTemplate
      title="About"
      func={showInfoDialogue}
    >
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_801_982)">
          <path d="M10.5 0C4.69666 0 0 4.69613 0 10.5C0 16.3033 4.69613 21 10.5 21C16.3033 21 21 16.3039 21 10.5C21 4.69674 16.3039 0 10.5 0ZM10.5 19.5349C5.51816 19.5349 1.46512 15.4819 1.46512 10.5C1.46512 5.51812 5.51816 1.46512 10.5 1.46512C15.4818 1.46512 19.5349 5.51812 19.5349 10.5C19.5349 15.4819 15.4818 19.5349 10.5 19.5349Z" fill="#4A4A4A"/>
          <path d="M10.5003 8.75269C9.87831 8.75269 9.43604 9.01535 9.43604 9.40233V14.6682C9.43604 14.9999 9.87831 15.3316 10.5003 15.3316C11.0946 15.3316 11.5783 14.9999 11.5783 14.6682V9.40225C11.5783 9.01531 11.0946 8.75269 10.5003 8.75269Z" fill="#4A4A4A"/>
          <path d="M10.5002 5.50464C9.86446 5.50464 9.36694 5.96073 9.36694 6.48594C9.36694 7.01118 9.8645 7.4811 10.5002 7.4811C11.1222 7.4811 11.6198 7.01118 11.6198 6.48594C11.6198 5.96073 11.1222 5.50464 10.5002 5.50464Z" fill="#4A4A4A"/>
        </g>
        <defs>
          <clipPath id="clip0_801_982">
            <rect width="21" height="21" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </MenuItemTemplate>
  );
}
