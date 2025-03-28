// function to check if a slot is in the past
export const isSlotInPast = (slotTime: string, slotDate: string): boolean => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // If the selected date is before today, all slots are in the past
  if (slotDate < today) {
      return true;
  }

  // If it's today, check if the slot time is in the past
  if (slotDate === today) {
      // Parse the slot time
      const [hours, minutes] = slotTime.split(":").map(Number);
      const slotDateTime = new Date();
      slotDateTime.setHours(hours, minutes, 0, 0);

      // If the slot time is earlier than current time, it's in the past
      return slotDateTime < now;
  }

  // Future date, slot is not in the past
  return false;
};