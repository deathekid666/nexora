import {redirect} from "next/navigation";
import {currentCustomer} from "@/lib/customer-auth";
import AccountPageClient from "@/components/AccountPageClient";
export const dynamic="force-dynamic";
export default async function AccountPage(){const user=await currentCustomer();if(!user)redirect("/login");return <AccountPageClient/>}
