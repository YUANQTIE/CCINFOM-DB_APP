import { format, parseISO } from "date-fns";

export function formatDateSafe(isoString: string) {
  if (!isoString) {
    return "-/-";
  }
  try {
    return format(parseISO(isoString), "MMM dd, yyyy");
  } catch (error) {
    console.warn(`Invalid date string received: ${isoString}`, error);
    return "Invalid Date";
  }
}
