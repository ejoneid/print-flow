export function getInitials(name: string | undefined | null) {
  const trimmedName = name?.trim();
  if (!trimmedName || trimmedName.length === 0) return null;
  return trimmedName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function getFirstAndLastInitials(name: string) {
  const initials = getInitials(name);
  return (initials?.[0] ?? "") + (initials?.[initials.length - 1] ?? "");
}
