import {neon} from "@neondatabase/serverless";
import {storeProducts} from "@/lib/store-products";
import {catalogs,type AllCatalogProduct,type CatalogVariant} from "@/lib/category-catalogs";
export type CatalogOverride={slug:string;priceMad:number;stock:number;enabled:boolean;updatedAt:string};
export type CustomCatalogProduct=AllCatalogProduct&{createdAt:string;stockCount:number;enabled:boolean};
function db(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL_NOT_CONFIGURED");return neon(process.env.DATABASE_URL);}
export async function catalogSchema(){
 const sql=db();
 await sql.query("CREATE TABLE IF NOT EXISTS lhawta_catalog_overrides (slug text PRIMARY KEY,price_mad integer NOT NULL CHECK(price_mad>0),stock integer NOT NULL CHECK(stock>=0),variants jsonb NOT NULL DEFAULT '[]'::jsonb,enabled boolean NOT NULL DEFAULT true,updated_at timestamptz NOT NULL DEFAULT now())");
 await sql.query("ALTER TABLE lhawta_catalog_overrides ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb");
 await sql.query("CREATE TABLE IF NOT EXISTS lhawta_custom_products (slug text PRIMARY KEY,category_slug text NOT NULL,brand text NOT NULL,name text NOT NULL,image text NOT NULL,images jsonb NOT NULL DEFAULT '[]'::jsonb,price_mad integer NOT NULL CHECK(price_mad>0),badge text,specs jsonb NOT NULL DEFAULT '[]'::jsonb,stock integer NOT NULL DEFAULT 0 CHECK(stock>=0),enabled boolean NOT NULL DEFAULT true,created_at timestamptz NOT NULL DEFAULT now())");
 await sql.query("ALTER TABLE lhawta_custom_products ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb");
 await sql.query("ALTER TABLE lhawta_custom_products ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb");
 await sql.query("UPDATE lhawta_custom_products SET images=jsonb_build_array(image) WHERE jsonb_array_length(images)=0 AND image IS NOT NULL AND image<>''");
}
export async function listCatalogOverrides():Promise<CatalogOverride[]>{await catalogSchema();return await db().query('SELECT slug,price_mad AS "priceMad",stock,enabled,updated_at::text AS "updatedAt" FROM lhawta_catalog_overrides ORDER BY slug') as CatalogOverride[];}
export async function saveCatalogOverride(slug:string,priceMad:number,stock:number,enabled:boolean){
 if(!storeProducts[slug]||!Number.isSafeInteger(priceMad)||priceMad<=0||!Number.isSafeInteger(stock)||stock<0||typeof enabled!=="boolean")throw new Error("INVALID_CATALOG_UPDATE");
 await catalogSchema();await db().query("INSERT INTO lhawta_catalog_overrides(slug,price_mad,stock,enabled) VALUES($1,$2,$3,$4) ON CONFLICT(slug) DO UPDATE SET price_mad=EXCLUDED.price_mad,stock=EXCLUDED.stock,enabled=EXCLUDED.enabled,updated_at=now()",[slug,priceMad,stock,enabled]);
}
function safeSlug(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70);}
function parseVariants(value:unknown):CatalogVariant[]{
 if(!Array.isArray(value)||value.length<1||value.length>60)throw new Error("INVALID_PRODUCT");
 const seen=new Set<string>();
 return value.map(raw=>{
  if(!raw||typeof raw!=="object")throw new Error("INVALID_PRODUCT");
  const v=raw as Record<string,unknown>;
  const storage=typeof v.storage==="string"?v.storage.trim().slice(0,50):"";
  const color=typeof v.color==="string"?v.color.trim().slice(0,50):"";
  const priceMad=Number(v.priceMad),stock=Number(v.stock);
  const compareAtPriceMad=v.compareAtPriceMad==null||v.compareAtPriceMad===""?null:Number(v.compareAtPriceMad);
  if(!storage||!color||!Number.isSafeInteger(priceMad)||priceMad<1||!Number.isSafeInteger(stock)||stock<0||
    (compareAtPriceMad!==null&&(!Number.isSafeInteger(compareAtPriceMad)||compareAtPriceMad<=priceMad)))throw new Error("INVALID_PRODUCT");
  const key=storage.toLocaleLowerCase()+"|"+color.toLocaleLowerCase();
  if(seen.has(key))throw new Error("INVALID_PRODUCT");seen.add(key);
  return {storage,color,priceMad,compareAtPriceMad,stock};
 });
}

export type BuiltInVariant={storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number};
export type ManagedBuiltInProduct={slug:string;name:string;brand:string;category:string;image:string;price:string;oldPrice?:string;variants:BuiltInVariant[];enabled:boolean};
function parseBuiltInVariants(value:unknown):BuiltInVariant[]{
 if(!Array.isArray(value)||value.length<1||value.length>100)throw new Error("INVALID_VARIANTS");
 const seen=new Set<string>();
 return value.map(raw=>{
  if(!raw||typeof raw!=="object")throw new Error("INVALID_VARIANTS");
  const v=raw as Record<string,unknown>,storage=typeof v.storage==="string"?v.storage.trim().slice(0,80):"",color=typeof v.color==="string"?v.color.trim().slice(0,60):"";
  const priceMad=Number(v.priceMad),stock=Number(v.stock),compareAtPriceMad=v.compareAtPriceMad==null||v.compareAtPriceMad===""?null:Number(v.compareAtPriceMad);
  if(!storage||!color||!Number.isSafeInteger(priceMad)||priceMad<1||!Number.isSafeInteger(stock)||stock<0||(compareAtPriceMad!==null&&(!Number.isSafeInteger(compareAtPriceMad)||compareAtPriceMad<=priceMad)))throw new Error("INVALID_VARIANTS");
  const key=storage.toLowerCase()+"|"+color.toLowerCase();if(seen.has(key))throw new Error("INVALID_VARIANTS");seen.add(key);
  return {storage,color,priceMad,compareAtPriceMad,stock};
 });
}
function moneyMad(value:number){return new Intl.NumberFormat("fr-MA").format(value)+" DH";}
function defaultVariants(slug:string):BuiltInVariant[]{
 const p=storeProducts[slug],priceMad=Number(p.price.replace(/[^0-9]/g,""))||1,compareAt=Number(p.oldPrice?.replace(/[^0-9]/g,""))||null;
 return p.variants.flatMap(storage=>p.colors.map(color=>({storage,color,priceMad,compareAtPriceMad:compareAt&&compareAt>priceMad?compareAt:null,stock:0})));
}
export async function listManagedBuiltIns():Promise<ManagedBuiltInProduct[]>{
 await catalogSchema();
 const rows=await db().query('SELECT slug,price_mad AS "priceMad",stock,enabled,variants FROM lhawta_catalog_overrides') as Array<{slug:string;priceMad:number;stock:number;enabled:boolean;variants:BuiltInVariant[]}>;
 const bySlug=new Map(rows.map(r=>[r.slug,r]));
 return Object.values(storeProducts).map(p=>{
  const saved=bySlug.get(p.slug),variants=saved?.variants?.length?saved.variants:defaultVariants(p.slug);
  const lowest=variants.reduce((a,b)=>a.priceMad<=b.priceMad?a:b);
  const compareAt=lowest.compareAtPriceMad;
  return {slug:p.slug,name:p.name,brand:p.brand,category:p.category,image:p.gallery[0],price:moneyMad(lowest.priceMad),oldPrice:compareAt&&compareAt>lowest.priceMad?moneyMad(compareAt):undefined,variants,enabled:saved?.enabled??true};
 });
}
export async function saveBuiltInVariants(slug:string,rawVariants:unknown,enabled:boolean){
 const p=storeProducts[slug];if(!p||typeof enabled!=="boolean")throw new Error("INVALID_CATALOG_UPDATE");
 const variants=parseBuiltInVariants(rawVariants),priceMad=Math.min(...variants.map(v=>v.priceMad)),stock=variants.reduce((n,v)=>n+v.stock,0);
 await catalogSchema();
 await db().query("INSERT INTO lhawta_catalog_overrides(slug,price_mad,stock,enabled,variants) VALUES($1,$2,$3,$4,$5::jsonb) ON CONFLICT(slug) DO UPDATE SET price_mad=EXCLUDED.price_mad,stock=EXCLUDED.stock,enabled=EXCLUDED.enabled,variants=EXCLUDED.variants,updated_at=now()",[slug,priceMad,stock,enabled,JSON.stringify(variants)]);
}
export async function findBuiltInOverride(slug:string){
 await catalogSchema();const rows=await db().query('SELECT price_mad AS "priceMad",stock,enabled,variants FROM lhawta_catalog_overrides WHERE slug=$1 LIMIT 1',[slug]) as Array<{priceMad:number;stock:number;enabled:boolean;variants:BuiltInVariant[]}>;
 return rows[0]||null;
}

export async function listCustomProducts(includeDisabled=false):Promise<CustomCatalogProduct[]>{
 await catalogSchema();
 const rows=await db().query('SELECT slug,category_slug AS "categorySlug",brand,name,image,images,price_mad AS "priceMad",badge,specs,stock,variants,enabled,created_at::text AS "createdAt" FROM lhawta_custom_products '+(includeDisabled?"":"WHERE enabled=true ")+'ORDER BY created_at DESC') as Array<Record<string,unknown>>;
 return rows.map(row=>{
  const categorySlug=String(row.categorySlug),category=catalogs[categorySlug];
  const variants=Array.isArray(row.variants)?row.variants as CatalogVariant[]:[];
  const storedImages=Array.isArray(row.images)?row.images.filter((item):item is string=>typeof item==="string"&&/^https:\/\//i.test(item)):[];
  const images=storedImages.length?storedImages:[String(row.image)];
  const cheapest=variants.length?variants.reduce((a,b)=>a.priceMad<=b.priceMad?a:b):null;
  const priceMad=cheapest?.priceMad??Number(row.priceMad);
  const compareAt=cheapest?.compareAtPriceMad;
  const sale=typeof compareAt==="number"&&compareAt>priceMad;
  const money=(v:number)=>new Intl.NumberFormat("fr-MA").format(v)+" DH";
  return {brand:String(row.brand),name:String(row.name),image:images[0]||String(row.image),images,price:money(priceMad),old:sale?money(compareAt):undefined,rating:"Nouveau",specs:Array.isArray(row.specs)?row.specs as string[]:[],badge:row.badge?String(row.badge):sale?"Promo":undefined,stock:Number(row.stock)>0,variants,categorySlug,categoryTitle:category?.title||categorySlug,detailSlug:undefined,productSlug:String(row.slug),createdAt:String(row.createdAt),stockCount:Number(row.stock),enabled:row.enabled!==false} as CustomCatalogProduct;
 });
}
export async function createCustomProduct(input:Record<string,unknown>){
 const categorySlug=typeof input.categorySlug==="string"?input.categorySlug:"",category=catalogs[categorySlug];
 const brand=typeof input.brand==="string"?input.brand.trim().slice(0,80):"";
 const name=typeof input.name==="string"?input.name.trim().slice(0,120):"";
 const rawImages=Array.isArray(input.images)?input.images:[];
 if(rawImages.length>8)throw new Error("INVALID_PRODUCT");
 const images=(rawImages.length?rawImages:[input.image]).map(value=>typeof value==="string"?value.trim().slice(0,2000):"");
 const image=images[0]||"";
 const badge=typeof input.badge==="string"?input.badge.trim().slice(0,40):"";
 const specs=Array.isArray(input.specs)?input.specs.filter((s):s is string=>typeof s==="string").map(s=>s.trim().slice(0,500)).filter(Boolean).slice(0,80):[];
 const variants=parseVariants(input.variants);
 if(!category||brand.length<1||name.length<2||images.length<1||images.length>8||images.some(value=>!/^https:\/\//i.test(value))||specs.length>80)throw new Error("INVALID_PRODUCT");
 const base=safeSlug(categorySlug+"-"+name);if(base.length<2)throw new Error("INVALID_SLUG");
 const slug=base,priceMad=Math.min(...variants.map(v=>v.priceMad)),stock=variants.reduce((sum,v)=>sum+v.stock,0);
 await catalogSchema();
 const rows=await db().query("INSERT INTO lhawta_custom_products(slug,category_slug,brand,name,image,images,price_mad,badge,specs,stock,variants) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9::jsonb,$10,$11::jsonb) ON CONFLICT(slug) DO NOTHING RETURNING slug",[slug,categorySlug,brand,name,image,JSON.stringify(images),priceMad,badge||null,JSON.stringify(specs),stock,JSON.stringify(variants)]) as Array<{slug:string}>;
 if(!rows.length)throw new Error("PRODUCT_EXISTS");return slug;
}
export async function updateCustomProduct(slug:string,input:Record<string,unknown>){
 const categorySlug=typeof input.categorySlug==="string"?input.categorySlug:"",category=catalogs[categorySlug];
 const brand=typeof input.brand==="string"?input.brand.trim().slice(0,80):"";
 const name=typeof input.name==="string"?input.name.trim().slice(0,120):"";
 const rawImages=Array.isArray(input.images)?input.images:[input.image];
 const images=rawImages.map(value=>typeof value==="string"?value.trim().slice(0,2000):"");
 const image=images[0]||"";
 const badge=typeof input.badge==="string"?input.badge.trim().slice(0,40):"";
 const specs=Array.isArray(input.specs)?input.specs.filter((s):s is string=>typeof s==="string").map(s=>s.trim().slice(0,100)).filter(Boolean).slice(0,8):[];
 const variants=parseVariants(input.variants);
 if(!slug||!category||brand.length<1||name.length<2||images.length<1||images.length>8||images.some(value=>!/^https:\/\//i.test(value))||specs.length>8)throw new Error("INVALID_PRODUCT");
 const priceMad=Math.min(...variants.map(v=>v.priceMad)),stock=variants.reduce((sum,v)=>sum+v.stock,0);
 await catalogSchema();
 const rows=await db().query("UPDATE lhawta_custom_products SET category_slug=$2,brand=$3,name=$4,image=$5,images=$6::jsonb,price_mad=$7,badge=$8,specs=$9::jsonb,stock=$10,variants=$11::jsonb WHERE slug=$1 RETURNING slug",[slug,categorySlug,brand,name,image,JSON.stringify(images),priceMad,badge||null,JSON.stringify(specs),stock,JSON.stringify(variants)]) as Array<{slug:string}>;
 if(!rows.length)throw new Error("PRODUCT_NOT_FOUND");
 return slug;
}
export async function deleteCustomProduct(slug:string){
 await catalogSchema();const rows=await db().query("DELETE FROM lhawta_custom_products WHERE slug=$1 RETURNING slug",[slug]) as Array<{slug:string}>;return Boolean(rows.length);
}
export async function listDisabledBuiltInSlugs(){await catalogSchema();const rows=await db().query("SELECT slug FROM lhawta_catalog_overrides WHERE enabled=false") as Array<{slug:string}>;return rows.map(row=>row.slug);}
export async function getCustomProductBySlug(slug:string){return (await listCustomProducts()).find(product=>product.productSlug===slug)||null;}
export async function findCustomProductForOrder(slug:string){
 await catalogSchema();
 const rows=await db().query('SELECT slug,brand,name,category_slug AS category,price_mad AS "priceMad",stock,enabled,variants FROM lhawta_custom_products WHERE slug=$1 LIMIT 1',[slug]) as Array<{slug:string;brand:string;name:string;category:string;priceMad:number;stock:number;enabled:boolean;variants:CatalogVariant[]}>;
 return rows[0]||null;
}
