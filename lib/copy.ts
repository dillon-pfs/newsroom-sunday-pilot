export function statusLabel(
  status: "scheduled" | "awaiting_official" | "in_progress" | "final",
) {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "awaiting_official":
      return "Awaiting official";
    case "in_progress":
      return "In progress";
    case "final":
      return "Final";
  }
}

export function formatScore(value: number | null) {
  return value === null ? "—" : String(value);
}

export function kindLabel(kind: string) {
  switch (kind) {
    case "fact":
      return "Fact";
    case "commentary":
      return "Commentary";
    case "correction":
      return "Correction";
    case "duplicate":
      return "Duplicate";
    case "status":
      return "Desk";
    default:
      return kind;
  }
}
