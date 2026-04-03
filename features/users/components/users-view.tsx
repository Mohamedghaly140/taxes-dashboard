import { requireAdmin } from "@/lib/auth/guards";
import { searchParamsCache } from "@/nuqs/search-params";
import { getUsers } from "../queries";
import { UsersTable } from "./users-table";

export async function UsersView({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await requireAdmin();

  const { search, page, limit } = await searchParamsCache.parse(searchParams);
  const { users, total, pageCount } = await getUsers({ search, page, limit });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>
      <UsersTable
        users={users}
        pageCount={pageCount}
        total={total}
        currentUserId={user.id}
      />
    </div>
  );
}
