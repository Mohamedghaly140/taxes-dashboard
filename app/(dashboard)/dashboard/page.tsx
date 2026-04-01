import { getCustomers } from "@/actions/customer.actions";
import { CustomersTable } from "@/components/customers/customers-table";
import { searchParamsCache } from "@/nuqs/search-params";

export default async function DashboardPage({
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
      <CustomersTable
        customers={customers}
        pageCount={pageCount}
        total={total}
      />
    </div>
  );
}
