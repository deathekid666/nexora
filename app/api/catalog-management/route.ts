import {NextRequest,NextResponse} from "next/server";
import {isAuthorizedAdmin} from "@/lib/admin-auth";
import {listCatalogOverrides,saveCatalogOverride,listCustomProducts,createCustomProduct,deleteCustomProduct} from "@/lib/catalog-admin";
import {storeProducts} from "@/lib/store-products";
export const runtime="nodejs";
export const dynamic="force-dynamic";
async function authorized(request:NextRequest){return await isAuthorizedAdmin(request)}
export async function GET(request:NextRequest){
 if(!(await authorized(request)))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{return NextResponse.json({products:Object.values(storeProducts).map(p=>({slug:p.slug,name:p.name,price:p.price})),overrides:await listCatalogOverrides(),customProducts:await listCustomProducts()})}
 catch{return NextResponse.json({error:"Database unavailable"},{status:503})}
}
export async function PATCH(request:NextRequest){
 if(!(await authorized(request)))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const input=await request.json();await saveCatalogOverride(input.slug,input.priceMad,input.stock,input.enabled);return NextResponse.json({ok:true})}
 catch{return NextResponse.json({error:"Invalid update"},{status:400})}
}
export async function POST(request:NextRequest){
 if(!(await authorized(request)))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const slug=await createCustomProduct(await request.json());return NextResponse.json({ok:true,slug},{status:201})}
 catch(error){const code=error instanceof Error?error.message:"INVALID_PRODUCT";return NextResponse.json({error:code==="PRODUCT_EXISTS"?"Un produit avec ce nom existe déjà.":"Informations produit invalides. Vérifiez les champs."},{status:400})}
}
export async function DELETE(request:NextRequest){
 if(!(await authorized(request)))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const slug=request.nextUrl.searchParams.get("slug")||"";if(!await deleteCustomProduct(slug))return NextResponse.json({error:"Produit introuvable."},{status:404});return NextResponse.json({ok:true})}
 catch{return NextResponse.json({error:"Database unavailable"},{status:503})}
}
