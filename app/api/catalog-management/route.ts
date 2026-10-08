import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listCatalogOverrides, saveCatalogOverride } from "@/lib/catalog-admin";
import { storeProducts } from "@/lib/store-products";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
  try { return NextResponse.json({products:Object.values(storeProducts).map(p=>({slug:p.slug,name:p.name,price:p.price})),overrides:await listCatalogOverrides()}); }
  catch { return NextResponse.json({error:"Database unavailable"},{status:503}); }
}
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
  try { const input=await request.json(); await saveCatalogOverride(input.slug,input.priceMad,input.stock,input.enabled); return NextResponse.json({ok:true}); }
  catch { return NextResponse.json({error:"Invalid update"},{status:400}); }
}
