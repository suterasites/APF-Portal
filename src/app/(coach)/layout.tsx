import { CoachLayout } from "@/components/layout/coach-layout";

export default function CoachRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CoachLayout>{children}</CoachLayout>;
}
