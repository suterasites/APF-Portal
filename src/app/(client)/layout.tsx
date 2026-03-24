import { ClientLayout } from "@/components/layout/client-layout";

export default function ClientRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
