import {neon} from "@neondatabase/serverless";
import {storeProducts} from "@/lib/store-products";
import {catalogs,type AllCatalogProduct} from "@/lib/category-catalogs";
export type CatalogOverride={slug:string;priceMad:number;stock:number;enabled:boolean;updatedAt:string};
export type CustomCatalogProduct=AllCatalogProduct&{createdAt:string;stockCount:number};
function db(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL_NOT_CONFIGURED");return neon(process.env.DATABASE_URL);}
export async function catalogSchema(){
 const sql=db();
 await sql.query("CREATE TABLE IF NOT EXISTS lhawta_catalog_overrides (slug text PRIMARY KEY,price_mad integer NOT NULL CHECK(price_mad>0),stock integer NOT NULL CHECK(stock>=0),enabled boolean NOT NULL DEFAULT true,updated_at timestamptz NOT NULL DEFAULT now())");
 await sql.query("CREATE TABLE IF NOT EXISTS lhawta_custom_products (slug text PRIMARY KEY,category_slug text NOT NULL,brand text NOT NULL,name text NOT NULL,image text NOT NULL,price_mad integer NOT NULL CHECK(price_mad>0),badge text,specs jsonb NOT NULL DEFAULT '[]'::jsonb,stock integer NOT NULL DEFAULT 0 CHECK(stock>=0),enabled boolean NOT NULL DEFAULT true,created_at timestamptz NOT NULL DEFAULT now())");
}
export async function listCatalogOverrides():Promise<CatalogOverride[]>{await catalogSchema();return await db().query('SELECT slug,price_mad AS "priceMad",stock,enabled,updated_at::text AS "updatedAt" FROM lhawta_catalog_overrides ORDER BY slug') as CatalogOverride[];}
export async function saveCatalogOverride(slug:string,priceMad:number,stock:number,enabled:boolean){
 if(!storeProducts[slug]||!Number.isSafeInteger(priceMad)||priceMad<=0||!Number.isSafeInteger(stock)||stock<0||typeof enabled!=="boolean")throw new Error("INVALID_CATALOG_UPDATE");
 await catalogSchema();await db().query("INSERT INTO lhawta_catalog_overrides(slug,price_mad,stock,enabled) VALUES($1,$2,$3,$4) ON CONFLICT(slug) DO UPDATE SET price_mad=EXCLUDED.price_mad,stock=EXCLUDED.stock,enabled=EXCLUDED.enabled,updated_at=now()",[slug,priceMad,stock,enabled]);
}
function safeSlug(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70);}
export async function listCustomProducts():Promise<CustomCatalogProduct[]>{
 await catalogSchema();
 const rows=await db().query("SELECT slug,category_slug AS \"categorySlug\",brand,name,image,price_mad AS \"priceMad\",badge,specs,stock,created_at::text AS \"createdAt\" FROM lhawta_custom_products WHERE enabled=true ORDER BY created_at DESC") as Array<Record<string,unknown>>;
 return rows.map(row=>{const categorySlug=String(row.categorySlug);const category=catalogs[categorySlug];return {brand:String(row.brand),name:String(row.name),image:String(row.image),price:new Intl.NumberFormat("fr-MA").format(Number(row.priceMad))+" DH",rating:"Nouveau",specs:Array.isArray(row.specs)?row.specs as string[]:[],badge:row.badge?String(row.badge):undefined,stock:Number(row.stock)>0,categorySlug,categoryTitle:category?.title||categorySlug,detailSlug:undefined,productSlug:String(row.slug),createdAt:String(row.createdAt),stockCount:Number(row.stock)} as CustomCatalogProduct;});
}
export async function createCustomProduct(input:Record<string,unknown>){
 const categorySlug=typeof input.categorySlug==="string"?input.categorySlug:"";
 const category=catalogs[categorySlug];
 const brand=typeof input.brand==="string"?input.brand.trim().slice(0,80):"";
 const name=typeof input.name==="string"?input.name.trim().slice(0,120):"";
 const image=typeof input.image==="string"?input.image.trim().slice(0,2000):"";
 const priceMad=Number(input.priceMad),stock=Number(input.stock);
 const badge=typeof input.badge==="string"?input.badge.trim().slice(0,40):"";
 const specs=Array.isArray(input.specs)?input.specs.filter((s):s is string=>typeof s==="string").map(s=>s.trim().slice(0,100)).filter(Boolean).slice(0,8):[];
 if(!category||brand.length<1||name.length<2||!Number.isSafeInteger(priceMad)||priceMad<1||!Number.isSafeInteger(stock)||stock<0||!/^https:\/\//i.test(image)||specs.length>8)throw new Error("INVALID_PRODUCT");
 await catalogSchema();const base=safeSlug(categorySlug+"-"+name);if(base.length<2)throw new Error("INVALID_SLUG");
 const slug=base;
 const rows=await db().query("INSERT INTO lhawta_custom_products(slug,category_slug,brand,name,image,price_mad,badge,specs,stock) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9) ON CONFLICT(slug) DO NOTHING RETURNING slug",[slug,categorySlug,brand,name,image,priceMad,badge||null,JSON.stringify(specs),stock]) as Array<{slug:string}>;
 if(!rows.length)throw new Error("PRODUCT_EXISTS");
 return slug;
}
export async function deleteCustomProduct(slug:string){
 await catalogSchema();
 const rows=await db().query("DELETE FROM lhawta_custom_products WHERE slug=$1 RETURNING slug",[slug]) as Array<{slug:string}>;
 return Boolean(rows.length);
}
export async function listDisabledBuiltInSlugs(){await catalogSchema();const rows=await db().query("SELECT slug FROM lhawta_catalog_overrides WHERE enabled=false") as Array<{slug:string}>;return rows.map(row=>row.slug);}
export async function getCustomProductBySlug(slug:string){
 return (await listCustomProducts()).find(product=>product.productSlug===slug)||null;
}
export async function findCustomProductForOrder(slug:string){
 await catalogSchema();
 const rows=await db().query("SELECT slug,brand,name,category_slug AS category,price_mad AS priceMad,stock,enabled FROM lhawta_custom_products WHERE slug=$1 LIMIT 1",[slug]) as Array<{slug:string;brand:string;name:string;category:string;priceMad:number;stock:number;enabled:boolean}>;
 return rows[0]||null;
}
