import {NextRequest,NextResponse} from "next/server";
import {storeProducts} from "@/lib/store-products";
import {findBuiltInOverride,listManagedBuiltIns} from "@/lib/catalog-admin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
 const slug=request.nextUrl.searchParams.get("slug")||"";
 try{
  if(!slug){
   const products=await listManagedBuiltIns();
   return NextResponse.json({products},{headers:{"cache-control":"no-store"}});
  }
  if(!storeProducts[slug])return NextResponse.json({error:"Not found"},{status:404});
  const saved=await findBuiltInOverride(slug);
  return NextResponse.json({variants:saved?.variants||[],enabled:saved?.enabled??true},{headers:{"cache-control":"no-store"}});
 }catch{return NextResponse.json({error:"Unavailable"},{status:503})}
}
