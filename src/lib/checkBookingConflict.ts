import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import { format } from 'date-fns';

export async function hasBookingConflict({
  firestore,
  officeId,
  workspaceId,
  startTime,
  endTime,
}: {
  firestore: Firestore;
  officeId: string;
  workspaceId: string;
  startTime: Date;
  endTime: Date;
}) {
  const dateStr = format(startTime, 'yyyy-MM-dd');

  const q = query(
    collection(firestore, "bookings"),
    where("officeId", "==", officeId),
    where("workspaceId", "==", workspaceId),
    where("status", "==", "confirmed"),
    where("date", "==", dateStr)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
      return false;
  }

  return snapshot.docs.some(doc => {
    const booking = doc.data();
    const existingStart = (booking.startTime as Timestamp).toDate();
    const existingEnd = (booking.endTime as Timestamp).toDate();

    // OVERLAP LOGIC
    return startTime < existingEnd && endTime > existingStart;
  });
}
