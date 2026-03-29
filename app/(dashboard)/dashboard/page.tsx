import { getCustomers } from "@/actions/customer.actions";
import { CustomersTable } from "@/components/customers/customers-table";

export default async function DashboardPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
}
