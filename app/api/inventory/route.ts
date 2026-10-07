import { NextRequest, NextResponse } from "next/server";
import {
  adjustInventory,
  getPublicInventoryBySlug,
  getPublicInventorySummaries,
  listInventory,
  listInventoryMovements,
} from "@/lib/inventory-db";
import { isOrderDatabaseConfigured } from "@/lib/order-db";
import { adminTokenConfigured, isAdminRequest, readAdminSession } from "@/lib/admin-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function adminGuard(request:NextRequest){
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

export async function GET(request:NextRequest){
  if(!isOrderDatabaseConfigured()){
    return NextResponse.json({ok:false,error:"DATABASE_NOT_CONFIGURED"},{status:503});
  }

  const slugs=request.nextUrl.searchParams.get("slugs")?.split(",").map(value=>value.trim()).filter(Boolean)||[];
  if(slugs.length){
    try{
      const inventory=await getPublicInventorySummaries(slugs);
      return NextResponse.json({ok:true,inventory});
    }catch(error){
      console.error("[LHAWTA inventory summaries]",error);
      return NextResponse.json({ok:false,error:"INVENTORY_LOOKUP_FAILED"},{status:500});
    }
  }

  const slug=request.nextUrl.searchParams.get("slug")?.trim()||"";
  if(slug){
    try{
      const rows=await getPublicInventoryBySlug(slug);
      return NextResponse.json({
        ok:true,
        inventory:rows.map(row=>({
          slug:row.slug,
          variant:row.variant,
          color:row.color,
          availableQty:row.availableQty,
          lowStock:row.lowStock,
        })),
      });
    }catch(error){
      console.error("[LHAWTA inventory public]",error);
      return NextResponse.json({ok:false,error:"INVENTORY_LOOKUP_FAILED"},{status:500});
    }
  }

  const authError=adminGuard(request);
  if(authError) return authError;

  try{
    const search=request.nextUrl.searchParams.get("search")||"";
    const lowStockOnly=request.nextUrl.searchParams.get("lowStock")==="1";
    const inventory=await listInventory({search,lowStockOnly,limit:800});
    const movements=await listInventoryMovements(120);
    return NextResponse.json({ok:true,inventory,movements});
  }catch(error){
    console.error("[LHAWTA inventory admin]",error);
    return NextResponse.json({ok:false,error:"INVENTORY_LIST_FAILED"},{status:500});
  }
}

export async function PATCH(request:NextRequest){
  const authError=adminGuard(request);
  if(authError) return authError;

  try{
    const body=await request.json().catch(()=>({})) as {
      id?:string;
      physicalQty?:number;
      lowStockThreshold?:number;
      reason?:string;
    };

    if(!body.id){
      return NextResponse.json({ok:false,error:"INVENTORY_ID_REQUIRED"},{status:400});
    }

    const session=readAdminSession(request);
    const item=await adjustInventory({
      id:body.id,
      physicalQty:Number(body.physicalQty)||0,
      lowStockThreshold:Number(body.lowStockThreshold)||0,
      reason:body.reason,
      actorLabel:session?.email||"Admin LHAWTA",
    });

    if(!item){
      return NextResponse.json({ok:false,error:"INVENTORY_NOT_FOUND"},{status:404});
    }

    return NextResponse.json({ok:true,item});
  }catch(error){
    const code=error instanceof Error?error.message:"INVENTORY_UPDATE_FAILED";
    if(code==="PHYSICAL_BELOW_RESERVED"){
      return NextResponse.json(
        {ok:false,error:code,message:"Le stock physique ne peut pas être inférieur au stock déjà réservé."},
        {status:409}
      );
    }
    console.error("[LHAWTA inventory update]",error);
    return NextResponse.json({ok:false,error:"INVENTORY_UPDATE_FAILED"},{status:500});
  }
}
