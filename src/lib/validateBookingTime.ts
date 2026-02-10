
import {
  OFFICE_OPEN_HOUR,
  EXTENDED_CLOSE_HOUR,
} from "./timeRules";

export function validateBookingTime(start: Date, end: Date) {
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  
  const officeOpen = OFFICE_OPEN_HOUR; // 8 AM
  const officeExtendedClose = EXTENDED_CLOSE_HOUR; // 8 PM
  const officeStandardClose = 17.5; // 5:30 PM

  // ❌ Before opening
  if (startHour < officeOpen) {
    return { valid: false, extended: false, reason: "Office opens at 8:00 AM." };
  }

  // ❌ After extended hours
  if (startHour >= officeExtendedClose || endHour > officeExtendedClose) {
    return { valid: false, extended: false, reason: "Bookings are only allowed until 8:00 PM." };
  }
  
  // ❌ End time is before or same as start time
  if (end <= start) {
    return { valid: false, extended: false, reason: "End time must be after start time." };
  }


  // ⚠️ Extended hours
  if (endHour > officeStandardClose) {
    return {
      valid: true,
      extended: true,
      message: "Your booking includes extended hours (after 5:30 PM), which may have different pricing.",
    };
  }

  // ✅ Normal hours
  return { valid: true, extended: false, message: "Booking within standard working hours." };
}
