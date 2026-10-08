import {redirect} from "next/navigation";
import {currentCustomer,currentAdminCustomer} from "@/lib/customer-auth";
import AccountPageClient from "@/components/AccountPageClient";
export const dynamic="force-dynamic";
export default async function AccountPage(){
 const user=await currentCustomer();
 if(!user)redirect("/login");
 const admin=await currentAdminCustomer();
 return <AccountPageClient isAdmin={Boolean(admin)}/>;
}
