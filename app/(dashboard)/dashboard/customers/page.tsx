import { CustomersView } from "@/features/customers";

export default function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <CustomersView searchParams={searchParams} />;
}
