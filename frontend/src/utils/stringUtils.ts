export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function getFirstAndLastInitials(name: string) {
  const initials = getInitials(name);
  return (initials[0] ?? '') + (initials[initials.length - 1] ?? '');
};
