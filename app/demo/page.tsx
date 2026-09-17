import { redirect } from "next/navigation";

export const metadata = {
  title: "SF 27–LAR 7 Melbourne",
};

export default function DemoPage() {
  redirect("/games/sunday-pilot");
}
