import { neon } from "@neondatabase/serverless";
import { storeProducts } from "@/lib/store-products";

export type CatalogOverride={slug:string;priceMad:number;stock:number;enabled:boolean;updatedAt:string};
function db(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL_NOT_CONFIGURED");return neon(process.env.DATABASE_URL);}
export async function catalogSchema(){
 const sql=db();
 await sql.query("CREATE TABLE IF NOT EXISTS lhawta_catalog_overrides (slug text PRIMARY KEY, price_mad integer NOT NULL CHECK(price_mad > 0), stock integer NOT NULL CHECK(stock >= 0), enabled boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now())");
}
export async function listCatalogOverrides():Promise<CatalogOverride[]>(){
 await catalogSchema();const sql=db();
 return await sql.query('SELECT slug,price_mad AS "priceMad",stock,enabled,updated_at::text AS "updatedAt" FROM lhawta_catalog_overrides ORDER BY slug') as CatalogOverride[];
}
export async function saveCatalogOverride(slug:string,priceMad:number,stock:number,enabled:boolean){
 if(!storeProducts[slug]||!Number.isSafeInteger(priceMad)||priceMad<=0||!Number.isSafeInteger(stock)||stock<0||typeof enabled!=="boolean")throw new Error("INVALID_CATALOG_UPDATE");
 await catalogSchema();const sql=db();
 await sql.query("INSERT INTO lhawta_catalog_overrides(slug,price_mad,stock,enabled) VALUES($1,$2,$3,$4) ON CONFLICT(slug) DO UPDATE SET price_mad=EXCLUDED.price_mad,stock=EXCLUDED.stock,enabled=EXCLUDED.enabled,updated_at=now()",[slug,priceMad,stock,enabled]);
}
