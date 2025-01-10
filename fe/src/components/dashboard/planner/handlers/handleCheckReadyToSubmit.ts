import { DateValue } from "@mantine/dates";

export const handleCheckReadyToSubmit = (
  title: string,
  content: string,
  label: string,
  datetime: DateValue,
  videoLinks: string[],
  pollButtonSelected: boolean,
  pollOptions: string[],
) => {

  // Check title, label, and datetime
  if (title === "") { return false; }
  if (label === "") { return false; }
  if (datetime === null) { return false; }

  // Check video links and content
  const isContentEmpty = (content: string) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.textContent?.trim() === "";
  }
  if (videoLinks.length === 0 && isContentEmpty(content)) { return false; }

  // Check all poll options are filled out
  if (pollButtonSelected) {
    for (const option of pollOptions) {
      if (option === "") { return false; }
    }
  }

  return true;
}
