import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

export default function Disclaimer() {
  const { connected } = useContext(AppContext);
  if (!connected) return null;
  return (
    <div className="disclaimer flex flex-row align-middle justify-center text-gray-500 text-normal">
      <p>
        This companion can make mistakes. Consider checking important
        information.
      </p>
    </div>
  );
}
