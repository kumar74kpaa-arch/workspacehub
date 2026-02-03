
import {
  OFFICE_OPEN_HOUR,
  OFFICE_CLOSE_HOUR,
  EXTENDED_CLOSE_HOUR,
} from "./timeRules";

export function validateBookingTime(start: Date, end: Date) {
  const startHour = start.getHours();
  const endHour = end.getHours() + (end.getMinutes() > 0 ? 1 : 0);

  // ❌ Before opening
  if (startHour < OFFICE_OPEN_HOUR) {
    return { valid: false, extended: false, reason: "Office opens at 8:00 AM." };
  }

  // ❌ After extended hours
  if (startHour >= EXTENDED_CLOSE_HOUR || endHour > EXTENDED_CLOSE_HOUR) {
    return { valid: false, extended: false, reason: "Bookings are only allowed until 8:00 PM." };
  }
  
  // ❌ End time is before or same as start time
  if (end <= start) {
    return { valid: false, extended: false, reason: "End time must be after start time." };
  }


  // ⚠️ Extended hours
  if (endHour > OFFICE_CLOSE_HOUR) {
    return {
      valid: true,
      extended: true,
      message: "Extended hours (6:00 PM – 8:00 PM) will incur extra charges.",
    };
  }

  // ✅ Normal hours
  return { valid: true, extended: false, message: "Booking within standard working hours (8:00 AM – 6:00 PM)." };
}
