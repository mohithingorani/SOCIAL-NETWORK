export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Aug"
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12

  return `${day} ${month} at ${hours}:${minutes} ${ampm}`;
}
