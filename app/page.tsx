import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { LandingPage } from "@/features/landing";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) redirect("/dashboard");
  return <LandingPage />;
}
