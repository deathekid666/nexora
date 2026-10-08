import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  isOrderDatabaseConfigured,
  listOrders,
  ORDER_STATUSES,
  type CreateOrderInput,
  type OrderStatus,
} from "@/lib/order-db";
import { isAuthorizedAdmin } from "@/lib/admin-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function databaseUnavailable(){
  return NextResponse.json(
    {ok:false,error:"DATABASE_NOT_CONFIGURED",message:"La base de commandes Neon n’est pas encore connectée à cet environnement."},
    {status:503}
  );
}

export async function POST(request:NextRequest){
  if(!isOrderDatabaseConfigured()) return databaseUnavailable();

  try{
    const body=await request.json() as CreateOrderInput;
    const order=await createOrder(body);
    return NextResponse.json({ok:true,order},{status:201});
  }catch(error){
    const code=error instanceof Error?error.message:"ORDER_CREATE_FAILED";
    const clientErrors=new Set([
      "CUSTOMER_FIELDS_REQUIRED",
      "INVALID_ORDER_ITEMS",
      "UNKNOWN_PRODUCT",
      "INVALID_VARIANT",
      "INVALID_COLOR",
      "INVALID_PRODUCT_PRICE",
      "PRODUCT_OUT_OF_STOCK",
    ]);
    const status=clientErrors.has(code)?400:500;
    console.error("[LHAWTA order create]",error);
    return NextResponse.json(
      {ok:false,error:code,message:status===400?"Les informations de commande sont invalides.":"Impossible d’enregistrer la commande pour le moment."},
      {status}
    );
  }
}

export async function GET(request:NextRequest){
  if(!(await isAuthorizedAdmin(request))){
    return NextResponse.json({ok:false,error:"UNAUTHORIZED"},{status:401});
  }
  if(!isOrderDatabaseConfigured()) return databaseUnavailable();

  try{
    const search=request.nextUrl.searchParams.get("search")||"";
    const requestedStatus=request.nextUrl.searchParams.get("status")||"ALL";
    const status=(requestedStatus==="ALL"||ORDER_STATUSES.includes(requestedStatus as OrderStatus))
      ? requestedStatus as OrderStatus|"ALL"
      : "ALL";
    const orders=await listOrders({search,status,limit:150});
    return NextResponse.json({ok:true,orders});
  }catch(error){
    console.error("[LHAWTA order list]",error);
    return NextResponse.json({ok:false,error:"ORDER_LIST_FAILED"},{status:500});
  }
}
