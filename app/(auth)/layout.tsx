import { MarketingAuthShell } from "@/features/landing";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <MarketingAuthShell>{children}</MarketingAuthShell>;
}
