import {NextResponse} from "next/server";
import {currentCustomer} from "@/lib/customer-auth";
import {isOrderDatabaseConfigured,listCustomerOrders} from "@/lib/order-db";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(){
  const customer=await currentCustomer();
  if(!customer?.id)return NextResponse.json({ok:false,message:"Connectez-vous pour consulter vos commandes."},{status:401,headers:{"Cache-Control":"private, no-store"}});
  if(!isOrderDatabaseConfigured())return NextResponse.json({ok:false,message:"Le suivi des commandes est temporairement indisponible."},{status:503,headers:{"Cache-Control":"private, no-store"}});
  try{
    const orders=await listCustomerOrders(String(customer.id));
    return NextResponse.json({ok:true,orders},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("[LHAWTA customer orders]",error);
    return NextResponse.json({ok:false,message:"Impossible de charger vos commandes pour le moment."},{status:500,headers:{"Cache-Control":"private, no-store"}});
  }
}
