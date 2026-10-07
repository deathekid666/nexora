import AdminOrdersClient from "@/components/AdminOrdersClient";

export const metadata={
  title:"Commandes COD | LHAWTA Admin",
  robots:{index:false,follow:false},
};

export default function AdminOrdersPage(){
  return <AdminOrdersClient/>;
}
