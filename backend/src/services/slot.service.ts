import { IDoctor } from "../models/doctor.js";
import Appointment from "../models/appointment.js";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (mins: number): string => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * Given a doctor's weekly availability config and a specific date,
 * generate the list of bookable time slots, excluding ones already
 * taken by a non-cancelled appointment.
 */
export const getAvailableSlotsForDate = async (
  doctor: IDoctor,
  dateStr: string // YYYY-MM-DD
): Promise<string[]> => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (isNaN(date.getTime())) return [];

  const dayName = DAY_NAMES[date.getDay()];
  const config = doctor.availability?.workingDays?.find((d) => d.day === dayName);

  if (!config || !config.isAvailable || !config.ranges?.length) {
    return [];
  }

  const duration = doctor.availability.slotDuration || 30;

  const allSlots: string[] = [];
  for (const range of config.ranges) {
    let start = toMinutes(range.start);
    const end = toMinutes(range.end);
    while (start + duration <= end) {
      allSlots.push(toHHMM(start));
      start += duration;
    }
  }

  // Exclude past slots if the date is today
  const now = new Date();
  const isToday = now.toISOString().slice(0, 10) === dateStr;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const bookedAppointments = await Appointment.find({
    doctor: doctor._id,
    date: dateStr,
    status: { $in: ["Pending", "Confirmed"] },
  }).select("time");

  const booked = new Set(bookedAppointments.map((a) => a.time));

  return allSlots.filter((slot) => {
    if (booked.has(slot)) return false;
    if (isToday && toMinutes(slot) <= nowMinutes) return false;
    return true;
  });
};

export const isSlotTaken = async (
  doctorId: string,
  date: string,
  time: string
): Promise<boolean> => {
  const existing = await Appointment.findOne({
    doctor: doctorId,
    date,
    time,
    status: { $in: ["Pending", "Confirmed"] },
  });
  return !!existing;
};
