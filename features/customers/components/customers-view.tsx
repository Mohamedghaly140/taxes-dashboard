import { searchParamsCache } from "@/nuqs/search-params";
import { getCustomers } from "../actions";
import { CustomersTable } from "./customers-table";

export async function CustomersView({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { search, page, limit } = await searchParamsCache.parse(searchParams);
  const { customers, total, pageCount } = await getCustomers({ search, page, limit });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>
      <CustomersTable customers={customers} pageCount={pageCount} total={total} />
    </div>
  );
}
