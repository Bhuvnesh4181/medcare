import Appointment from "../_Components/appointment/appointmentComp";
import { doctors } from "../_Components/CardsGrid/ShowCards";
export default function Booking() {
    return <Appointment doctor={doctors[0]} />;
}