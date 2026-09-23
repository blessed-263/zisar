import type { City } from "./types";
import { CITIES } from "./constants";

const SLUGS: Record<City, string> = {
  Moscow: "moscow",
  Kazan: "kazan",
  Belgorod: "belgorod",
  "St Petersburg": "st-petersburg",
};

export function citySlug(city: City): string {
  return SLUGS[city];
}

export function cityFromSlug(slug: string): City | undefined {
  return CITIES.find((c) => SLUGS[c] === slug);
}
