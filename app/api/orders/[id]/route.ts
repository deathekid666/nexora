import { NextRequest, NextResponse } from "next/server";
import {
  getOrderById,
  isOrderDatabaseConfigured,
  ORDER_STATUSES,
  type OrderStatus,
  updateOrderShipping,
  updateOrderStatus,
} from "@/lib/order-db";
import { adminTokenConfigured, isAdminRequest, readAdminSession } from "@/lib/admin-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function authorized(request:NextRequest){
  if(!adminTokenConfigured()){
    return NextResponse.json({ok:false,error:"ADMIN_AUTH_NOT_CONFIGURED"},{status:503});
  }
  if(!isAdminRequest(request)){
    return NextResponse.json({ok:false,error:"UNAUTHORIZED"},{status:401});
  }
  if(!isOrderDatabaseConfigured()){
    return NextResponse.json({ok:false,error:"DATABASE_NOT_CONFIGURED"},{status:503});
  }
  return null;
}

export async function GET(
  request:NextRequest,
  {params}:{params:Promise<{id:string}>}
){
  const authError=authorized(request);
  if(authError) return authError;

  try{
    const {id}=await params;
    const order=await getOrderById(id);
    if(!order) return NextResponse.json({ok:false,error:"ORDER_NOT_FOUND"},{status:404});
    return NextResponse.json({ok:true,order});
  }catch(error){
    console.error("[LHAWTA order get]",error);
    return NextResponse.json({ok:false,error:"ORDER_GET_FAILED"},{status:500});
  }
}

export async function PATCH(
  request:NextRequest,
  {params}:{params:Promise<{id:string}>}
){
  const authError=authorized(request);
  if(authError) return authError;

  try{
    const {id}=await params;
    const body=await request.json() as {
      status?:string;
      shipping?:{
        courierName?:string;
        trackingNumber?:string;
        trackingUrl?:string;
        shippedAt?:string;
        estimatedDeliveryDate?:string;
        shippingMad?:number;
        deliveryNote?:string;
      };
    };

    if(body.shipping&&typeof body.shipping==="object"){
      const order=await updateOrderShipping(id,body.shipping);
      if(!order) return NextResponse.json({ok:false,error:"ORDER_NOT_FOUND"},{status:404});
      return NextResponse.json({ok:true,order});
    }

    const status=body.status as OrderStatus;
    if(!ORDER_STATUSES.includes(status)){
      return NextResponse.json({ok:false,error:"INVALID_STATUS"},{status:400});
    }

    const session=readAdminSession(request);
    const actorLabel=session?.email||"Admin LHAWTA";
    const order=await updateOrderStatus(id,status,actorLabel);
    if(!order) return NextResponse.json({ok:false,error:"ORDER_NOT_FOUND"},{status:404});
    return NextResponse.json({ok:true,order});
  }catch(error){
    const code=error instanceof Error?error.message:"ORDER_UPDATE_FAILED";
    if(code==="INVALID_STATUS_TRANSITION"){
      return NextResponse.json(
        {ok:false,error:code,message:"Transition de statut non autorisée."},
        {status:409}
      );
    }
    if(code==="SHIPPING_LOCKED"){
      return NextResponse.json(
        {ok:false,error:code,message:"La livraison ne peut plus être modifiée pour cette commande."},
        {status:409}
      );
    }
    if(code==="INVALID_TRACKING_URL"||code==="INVALID_DELIVERY_DATE"||code==="INVALID_SHIPPED_AT"){
      return NextResponse.json(
        {ok:false,error:code,message:"Les informations de livraison contiennent une valeur invalide."},
        {status:400}
      );
    }
    console.error("[LHAWTA order update]",error);
    return NextResponse.json({ok:false,error:"ORDER_UPDATE_FAILED"},{status:500});
  }
}
