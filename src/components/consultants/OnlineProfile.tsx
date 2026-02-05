import { ConsultantRating } from "../../model/consultantRating";
import { IoIosGlobe } from "react-icons/io";

export default function OnlineProfile({
  rating,
}: {
  rating: ConsultantRating;
}) {
  const iconClass = "w-6 h-6";

  if (!rating.analyst_linkedin_url) {
    return null;
  }
  return (
    <div className="flex flex-row gap-2 items-center text-xl">
      <a
        href={rating.analyst_linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center transition duration-300 ease-in-out hover:underline"
        title="Online profile"
      >
        <IoIosGlobe className={iconClass} />
      </a>
    </div>
  );
}
