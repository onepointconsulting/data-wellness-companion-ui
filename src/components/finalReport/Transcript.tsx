import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { AccordionText } from "../accordion/AccordionText.tsx";

export default function Transcript() {
  const { messages } = useContext(AppContext);
  return (
    <AccordionText title={"Transcript"}>
      <ol className="text-black list-decimal gray-color">
        {messages
          .filter((message) => !message.final_report)
          .map((message, i) => (
              <li className="mb-4" key={`qa_${i}`}>
                  <p>
                      <span className="italic">{message.question}</span>
                      <br/>
                      {message.answer}
                  </p>
              </li>
          ))}
      </ol>
    </AccordionText>
  );
}
