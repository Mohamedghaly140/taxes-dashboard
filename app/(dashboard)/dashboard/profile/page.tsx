import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/users/components/profile-form";

export default async function ProfilePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <ProfileForm name={user.name} email={user.email} />
      <div className="rounded-md border p-4 text-sm">
        <span className="text-muted-foreground">Status</span>
        <p className="font-medium">{user.status}</p>
      </div>
    </div>
  );
}
