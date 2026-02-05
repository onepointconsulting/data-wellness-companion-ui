import { ConsultantRating } from "../../model/consultantRating";
import MarkdownComponent from "../Markdown";
import ConsultantPhoto from "./ConsultantPhoto";
import OnlineProfile from "./OnlineProfile";
import RatingBadge from "./RatingBadge";

export default function ConsultantCard({
  rating,
}: {
  rating: ConsultantRating;
}) {
  return (
    <div className="flex flex-col gap-4 dark:text-[#fafffe] bg-[#F3E5FF] dark:bg-[#bb66ff45] p-6 rounded-2xl">
      <div className="flex flex-row items-center text-2xl gap-6">
        <div className="w-20 h-20 shrink-0">
          <ConsultantPhoto rating={rating} />
        </div>
        <div className="flex flex-col gap-2 overflow-hidden text-ellipsis">
          <p
            className="mt-[-6px] font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis"
            title={rating.analyst_name}
          >
            {rating.analyst_name}
          </p>
          <div className="flex flex-row items-center gap-2">
            <RatingBadge rating={rating} />
            <OnlineProfile rating={rating} />
          </div>
        </div>
      </div>
      <MarkdownComponent
        content={rating.reasoning}
        className="w-full text-base"
      />
    </div>
  );
}
