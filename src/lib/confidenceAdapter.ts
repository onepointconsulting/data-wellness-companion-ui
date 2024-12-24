import { TFunction } from "i18next";
import { Confidence } from "../model/confidence.ts";

export function confidenceAdapter(
  t: TFunction<"translation", undefined>,
  confidence: Confidence | null,
) {
  return confidence?.rating ? t(`confidence_${confidence?.rating}`) : "???";
}
