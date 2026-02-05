import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext.tsx";
import { ConsultantRating } from "../../model/consultantRating.ts";

function ConsultantPhoto({ rating }: { rating: ConsultantRating }) {
  const { reportUrl } = useContext(ChatContext);
  const [imageError, setImageError] = useState(false);
  const initials = rating.analyst_name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!imageError) {
    return (
      <a
        href={rating.analyst_linkedin_url ?? ""}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`${reportUrl}/consultant/image/${rating.email}`}
          alt={rating.analyst_name}
          className="w-20 rounded-full aspect-square object-cover shadow-sm border border-black/5"
          onError={() => setImageError(true)}
        />
      </a>
    );
  }

  return (
    <a
      href={rating.analyst_linkedin_url ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9A19FF]/20 to-[#9A19FF]/10 flex items-center justify-center shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#9A19FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="text-[#9A19FF] text-2xl font-bold tracking-tight">
          {initials}
        </span>
      </div>
    </a>
  );
}

export default ConsultantPhoto;
