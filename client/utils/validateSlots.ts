import { Slot } from "../app/_Components/appointment/appointmentComp";
import { isSlotInPast } from "@/utils/checkSlot";

export const validateSlots = (data: any, selectedDate: string) => {
    return data.map((slot: Slot) => {
        const isPastSlot = isSlotInPast(slot.slot_time, selectedDate);

        return {
            ...slot,
            id: slot.id,
            doctor_id: slot.doctor_id,
            slot_time: slot.slot_time,
            slot_type: slot.slot_type || "morning",
            is_available: isPastSlot
                ? false
                : typeof slot.is_available === "boolean"
                ? slot.is_available
                : true,
        };
    });
};