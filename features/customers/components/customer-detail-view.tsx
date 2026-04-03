import { notFound } from "next/navigation";
import { getCustomer } from "../queries";
import { CustomerDetail } from "./customer-detail";

export async function CustomerDetailView({ id }: { id: string }) {
  const customer = await getCustomer(id);
  if (!customer) notFound();
  return <CustomerDetail customer={customer} />;
}
