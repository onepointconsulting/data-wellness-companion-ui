import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getColorForRating } from "../../lib/getColorForRating";

interface Confidence {
  rating: number;
}

interface ConfidenceLevelProps {
  confidence: Confidence | null;
}

const ConfidenceLevel: React.FC<ConfidenceLevelProps> = ({ confidence }) => {
  const rating = confidence?.rating || 0;
  const color = getColorForRating(rating);
  return (
    <div style={{ width: 130, height: 130 }}>
      <CircularProgressbarWithChildren
        value={rating}
        strokeWidth={50}
        maxValue={1}
        styles={buildStyles({
          strokeLinecap: "butt",
          pathColor: color,
          trailColor: "#0d9488",
        })}
      />
    </div>
  );
};

export default ConfidenceLevel;
