export function formatTime(timeStr: string): string {
  try {
      // Check if timeStr is already a time string (HH:MM:SS)
      if (timeStr.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
          // It's already in HH:MM format, just format for display
          const [hours, minutes] = timeStr.split(":");
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
      }

      // Otherwise, treat as a full date string
      return new Date(timeStr).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
      });
  } catch (error) {
      return timeStr; // Return original if parsing fails
  }
}