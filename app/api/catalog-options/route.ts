import {NextRequest,NextResponse} from "next/server";
import {storeProducts} from "@/lib/store-products";
import {findBuiltInOverride} from "@/lib/catalog-admin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
 const slug=request.nextUrl.searchParams.get("slug")||"";
 if(!storeProducts[slug])return NextResponse.json({error:"Not found"},{status:404});
 try{const saved=await findBuiltInOverride(slug);return NextResponse.json({variants:saved?.variants||[]},{headers:{"cache-control":"no-store"}})}catch{return NextResponse.json({error:"Unavailable"},{status:503})}
}
