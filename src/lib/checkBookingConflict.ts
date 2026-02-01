import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import { startOfDay, endOfDay } from 'date-fns';

export async function hasBookingConflict({
  firestore,
  workspaceId,
  startTime,
  endTime,
}: {
  firestore: Firestore;
  workspaceId: string;
  startTime: Date;
  endTime: Date;
}) {
  const dayStart = startOfDay(startTime);
  const dayEnd = endOfDay(startTime);

  const q = query(
    collection(firestore, "bookings"),
    where("workspaceId", "==", workspaceId),
    where("status", "==", "confirmed"),
    where("startTime", ">=", dayStart),
    where("startTime", "<=", dayEnd)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
      return false;
  }

  return snapshot.docs.some(doc => {
    const booking = doc.data();
    const existingStart = (booking.startTime as Timestamp).toDate();
    const existingEnd = (booking.endTime as Timestamp).toDate();

    return startTime < existingEnd && endTime > existingStart;
  });
}
