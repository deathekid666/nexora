import {currentAdminCustomer} from "@/lib/customer-auth";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export const metadata={
  title:"Commandes COD | LHAWTA Admin",
  robots:{index:false,follow:false},
};

export default async function AdminOrdersPage(){
  const admin=await currentAdminCustomer();
  return <AdminOrdersClient sessionAdmin={Boolean(admin)}/>;
}
