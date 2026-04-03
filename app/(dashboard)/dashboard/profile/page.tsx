import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded-md border p-4 space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Name</span>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Email</span>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Status</span>
          <p className="font-medium">{user.status}</p>
        </div>
      </div>
    </div>
  );
}
