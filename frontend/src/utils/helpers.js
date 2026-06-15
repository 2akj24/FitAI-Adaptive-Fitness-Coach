export function formatText(value) {
  if (!value) return "--";

  return String(value)
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}