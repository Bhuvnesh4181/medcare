import { Slot } from "../app/_Components/appointment/appointmentComp";
import { isSlotInPast } from "./checkSlot";

export const validateSlots = (data: any, selectedDate: string) => {
    return data.map((slot: Slot) => {
        const isPastSlot = isSlotInPast(slot.slot_time, selectedDate);

        return {
            ...slot,
            id: slot.id,
            doctor_id: slot.doctor_id,
            slot_time: slot.slot_time,
            slot_type: slot.slot_type || "morning", // Default to morning if missing
            is_available: isPastSlot ? false : true,
        };
    });
};