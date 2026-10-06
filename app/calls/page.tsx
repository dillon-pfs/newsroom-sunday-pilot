import { CallsList } from "@/components/calls-list";
import { listCalls } from "@/lib/calls";
import { shareMetadata } from "@/lib/share";

export const metadata = shareMetadata(
  "Chip’s calls",
  "Chip Absolute’s takes, and how each one held up.",
);

export default function CallsPage() {
  return <CallsList calls={listCalls()} />;
}
