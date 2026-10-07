import { NextRequest, NextResponse } from "next/server";
import {
  getOrderByNumberAndPhone,
  isOrderDatabaseConfigured,
  listCustomerOrdersByVerifiedOrder,
} from "@/lib/order-db";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:NextRequest){
  if(!isOrderDatabaseConfigured()){
    return NextResponse.json(
      {ok:false,error:"DATABASE_NOT_CONFIGURED",message:"La base de commandes n’est pas disponible dans cet environnement."},
      {status:503}
    );
  }

  try{
    const body=await request.json().catch(()=>({}));
    const orderNumber=typeof body?.orderNumber==="string"?body.orderNumber:"";
    const phone=typeof body?.phone==="string"?body.phone:"";

    if(!orderNumber.trim()||phone.replace(/\D/g,"").length<8){
      return NextResponse.json(
        {ok:false,error:"INVALID_LOOKUP",message:"Numéro de commande et téléphone requis."},
        {status:400}
      );
    }

    const order=await getOrderByNumberAndPhone(orderNumber,phone);
    if(!order){
      return NextResponse.json(
        {ok:false,error:"ORDER_NOT_FOUND",message:"Aucune commande ne correspond à ces informations."},
        {status:404}
      );
    }

    const orders=await listCustomerOrdersByVerifiedOrder(orderNumber,phone);
    return NextResponse.json({ok:true,order,orders});
  }catch(error){
    console.error("[LHAWTA customer order lookup]",error);
    return NextResponse.json(
      {ok:false,error:"ORDER_LOOKUP_FAILED",message:"Impossible de vérifier la commande pour le moment."},
      {status:500}
    );
  }
}
