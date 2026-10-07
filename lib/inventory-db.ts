import { neon } from "@neondatabase/serverless";
import { storeProducts } from "@/lib/store-products";
import { allCatalogProducts } from "@/lib/category-catalogs";

export type InventoryRow={
  id:string;
  slug:string;
  brand:string;
  productName:string;
  variant:string;
  color:string;
  physicalQty:number;
  reservedQty:number;
  soldQty:number;
  availableQty:number;
  lowStockThreshold:number;
  lowStock:boolean;
  updatedAt:string;
};

export type InventoryMovement={
  id:string;
  inventoryId:string;
  orderId:string|null;
  movementType:"ADJUST"|"RESERVE"|"RELEASE"|"SALE";
  physicalDelta:number;
  reservedDelta:number;
  soldDelta:number;
  actorLabel:string|null;
  reason:string|null;
  createdAt:string;
  slug:string;
  productName:string;
  variant:string;
  color:string;
};

let sqlClient:ReturnType<typeof neon>|null=null;
let inventorySchemaPromise:Promise<void>|null=null;

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) throw new Error("DATABASE_URL_NOT_CONFIGURED");
  if(!sqlClient) sqlClient=neon(url);
  return sqlClient;
}

function clean(value:unknown,max=500){
  return typeof value==="string"?value.trim().slice(0,max):"";
}

function buildInventorySeed(){
  const rows:Array<{
    id:string;
    slug:string;
    brand:string;
    productName:string;
    variant:string;
    color:string;
  }>=[];
  const seen=new Set<string>();

  for(const product of Object.values(storeProducts)){
    for(const variant of product.variants.length?product.variants:["Standard"]){
      for(const color of product.colors.length?product.colors:["Standard"]){
        const key=[product.slug,variant,color].join("|");
        if(seen.has(key)) continue;
        seen.add(key);
        rows.push({
          id:crypto.randomUUID(),
          slug:product.slug,
          brand:product.brand,
          productName:product.name,
          variant,
          color,
        });
      }
    }
  }

  for(const product of allCatalogProducts){
    if(storeProducts[product.productSlug]) continue;
    const variant="Standard";
    const color="Standard";
    const key=[product.productSlug,variant,color].join("|");
    if(seen.has(key)) continue;
    seen.add(key);
    rows.push({
      id:crypto.randomUUID(),
      slug:product.productSlug,
      brand:product.brand,
      productName:product.name,
      variant,
      color,
    });
  }

  return rows;
}

export async function ensureInventorySchema(){
  if(inventorySchemaPromise) return inventorySchemaPromise;

  inventorySchemaPromise=(async()=>{
    const sql=db();
    await sql.query("CREATE TABLE IF NOT EXISTS lhawta_inventory (id uuid PRIMARY KEY, slug text NOT NULL, brand text NOT NULL, product_name text NOT NULL, variant text NOT NULL, color text NOT NULL, physical_qty integer NOT NULL DEFAULT 0 CHECK (physical_qty >= 0), reserved_qty integer NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0), sold_qty integer NOT NULL DEFAULT 0 CHECK (sold_qty >= 0), low_stock_threshold integer NOT NULL DEFAULT 2 CHECK (low_stock_threshold >= 0), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (slug,variant,color), CHECK (physical_qty >= reserved_qty))");
    await sql.query("CREATE TABLE IF NOT EXISTS lhawta_inventory_movements (id uuid PRIMARY KEY, inventory_id uuid NOT NULL REFERENCES lhawta_inventory(id) ON DELETE CASCADE, order_id uuid, movement_type text NOT NULL CHECK (movement_type IN ('ADJUST','RESERVE','RELEASE','SALE')), physical_delta integer NOT NULL DEFAULT 0, reserved_delta integer NOT NULL DEFAULT 0, sold_delta integer NOT NULL DEFAULT 0, actor_label text, reason text, created_at timestamptz NOT NULL DEFAULT now())");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_inventory_slug_idx ON lhawta_inventory (slug)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_inventory_low_stock_idx ON lhawta_inventory ((physical_qty-reserved_qty), low_stock_threshold)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_inventory_movements_created_at_idx ON lhawta_inventory_movements (created_at DESC)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_inventory_movements_inventory_idx ON lhawta_inventory_movements (inventory_id, created_at DESC)");

    await sql.query(
      "CREATE OR REPLACE FUNCTION lhawta_reserve_inventory(p_order_id uuid,p_items jsonb) RETURNS boolean LANGUAGE plpgsql AS $$ DECLARE rec record; inv record; BEGIN FOR rec IN SELECT x.slug,x.variant,x.color,sum(x.quantity)::integer AS quantity FROM jsonb_to_recordset(p_items) AS x(slug text,variant text,color text,quantity integer) GROUP BY x.slug,x.variant,x.color LOOP UPDATE lhawta_inventory SET reserved_qty=reserved_qty+rec.quantity,updated_at=now() WHERE slug=rec.slug AND variant=rec.variant AND color=rec.color AND (physical_qty-reserved_qty)>=rec.quantity RETURNING id,physical_qty,reserved_qty,sold_qty INTO inv; IF NOT FOUND THEN RAISE EXCEPTION 'OUT_OF_STOCK:%|%|%',rec.slug,rec.variant,rec.color; END IF; INSERT INTO lhawta_inventory_movements (id,inventory_id,order_id,movement_type,reserved_delta,actor_label,reason) VALUES (gen_random_uuid(),inv.id,p_order_id,'RESERVE',rec.quantity,'SYSTEM','Réservation commande'); END LOOP; RETURN true; END $$"
    );

    await sql.query(
      "CREATE OR REPLACE FUNCTION lhawta_apply_inventory_status(p_order_id uuid,p_previous text,p_next text,p_actor text) RETURNS boolean LANGUAGE plpgsql AS $$ DECLARE rec record; inv record; BEGIN IF p_next='ANNULE' THEN FOR rec IN SELECT slug,variant,color,sum(quantity)::integer AS quantity FROM lhawta_order_items WHERE order_id=p_order_id GROUP BY slug,variant,color LOOP UPDATE lhawta_inventory SET reserved_qty=reserved_qty-rec.quantity,updated_at=now() WHERE slug=rec.slug AND variant=rec.variant AND color=rec.color AND reserved_qty>=rec.quantity RETURNING id,physical_qty,reserved_qty,sold_qty INTO inv; IF NOT FOUND THEN RAISE EXCEPTION 'INVENTORY_RELEASE_FAILED:%|%|%',rec.slug,rec.variant,rec.color; END IF; INSERT INTO lhawta_inventory_movements (id,inventory_id,order_id,movement_type,reserved_delta,actor_label,reason) VALUES (gen_random_uuid(),inv.id,p_order_id,'RELEASE',-rec.quantity,p_actor,'Commande annulée'); END LOOP; ELSIF p_next='LIVRE' THEN FOR rec IN SELECT slug,variant,color,sum(quantity)::integer AS quantity FROM lhawta_order_items WHERE order_id=p_order_id GROUP BY slug,variant,color LOOP UPDATE lhawta_inventory SET physical_qty=physical_qty-rec.quantity,reserved_qty=reserved_qty-rec.quantity,sold_qty=sold_qty+rec.quantity,updated_at=now() WHERE slug=rec.slug AND variant=rec.variant AND color=rec.color AND physical_qty>=rec.quantity AND reserved_qty>=rec.quantity RETURNING id,physical_qty,reserved_qty,sold_qty INTO inv; IF NOT FOUND THEN RAISE EXCEPTION 'INVENTORY_SALE_FAILED:%|%|%',rec.slug,rec.variant,rec.color; END IF; INSERT INTO lhawta_inventory_movements (id,inventory_id,order_id,movement_type,physical_delta,reserved_delta,sold_delta,actor_label,reason) VALUES (gen_random_uuid(),inv.id,p_order_id,'SALE',-rec.quantity,-rec.quantity,rec.quantity,p_actor,'Commande livrée'); END LOOP; END IF; RETURN true; END $$"
    );

    const seed=buildInventorySeed();
    await sql.query(
      "WITH data AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS x(id uuid,slug text,brand text,\"productName\" text,variant text,color text)) INSERT INTO lhawta_inventory (id,slug,brand,product_name,variant,color) SELECT id,slug,brand,\"productName\",variant,color FROM data ON CONFLICT (slug,variant,color) DO UPDATE SET brand=EXCLUDED.brand,product_name=EXCLUDED.product_name",
      [JSON.stringify(seed)]
    );
  })();

  try{
    await inventorySchemaPromise;
  }catch(error){
    inventorySchemaPromise=null;
    throw error;
  }
}

export async function getPublicInventoryBySlug(slug:string):Promise<InventoryRow[]>{
  await ensureInventorySchema();
  const sql=db();
  const safeSlug=clean(slug,160);
  if(!safeSlug) return [];

  return sql.query(
    "SELECT id::text AS id,slug,brand,product_name AS \"productName\",variant,color,physical_qty AS \"physicalQty\",reserved_qty AS \"reservedQty\",sold_qty AS \"soldQty\",GREATEST(physical_qty-reserved_qty,0) AS \"availableQty\",low_stock_threshold AS \"lowStockThreshold\",(physical_qty-reserved_qty)<=low_stock_threshold AS \"lowStock\",updated_at::text AS \"updatedAt\" FROM lhawta_inventory WHERE slug=$1 ORDER BY variant,color",
    [safeSlug]
  ) as Promise<InventoryRow[]>;
}

export async function listInventory(options?:{
  search?:string;
  lowStockOnly?:boolean;
  limit?:number;
}):Promise<InventoryRow[]>{
  await ensureInventorySchema();
  const sql=db();
  const search=clean(options?.search,160);
  const limit=Math.max(1,Math.min(1000,options?.limit||500));
  return sql.query(
    "SELECT id::text AS id,slug,brand,product_name AS \"productName\",variant,color,physical_qty AS \"physicalQty\",reserved_qty AS \"reservedQty\",sold_qty AS \"soldQty\",GREATEST(physical_qty-reserved_qty,0) AS \"availableQty\",low_stock_threshold AS \"lowStockThreshold\",(physical_qty-reserved_qty)<=low_stock_threshold AS \"lowStock\",updated_at::text AS \"updatedAt\" FROM lhawta_inventory WHERE ($1='' OR slug ILIKE $2 OR brand ILIKE $2 OR product_name ILIKE $2 OR variant ILIKE $2 OR color ILIKE $2) AND ($3::boolean=false OR (physical_qty-reserved_qty)<=low_stock_threshold) ORDER BY ((physical_qty-reserved_qty)<=low_stock_threshold) DESC,brand,product_name,variant,color LIMIT $4",
    [search,"%"+search+"%",Boolean(options?.lowStockOnly),limit]
  ) as Promise<InventoryRow[]>;
}

export async function listInventoryMovements(limit=100):Promise<InventoryMovement[]>{
  await ensureInventorySchema();
  const sql=db();
  const safeLimit=Math.max(1,Math.min(500,Math.floor(limit)||100));
  return sql.query(
    "SELECT m.id::text AS id,m.inventory_id::text AS \"inventoryId\",m.order_id::text AS \"orderId\",m.movement_type AS \"movementType\",m.physical_delta AS \"physicalDelta\",m.reserved_delta AS \"reservedDelta\",m.sold_delta AS \"soldDelta\",m.actor_label AS \"actorLabel\",m.reason,m.created_at::text AS \"createdAt\",i.slug,i.product_name AS \"productName\",i.variant,i.color FROM lhawta_inventory_movements m JOIN lhawta_inventory i ON i.id=m.inventory_id ORDER BY m.created_at DESC LIMIT $1",
    [safeLimit]
  ) as Promise<InventoryMovement[]>;
}

export async function adjustInventory(input:{
  id:string;
  physicalQty:number;
  lowStockThreshold:number;
  reason?:string;
  actorLabel?:string|null;
}):Promise<InventoryRow|null>{
  await ensureInventorySchema();
  const sql=db();
  const id=clean(input?.id,80);
  const physicalQty=Math.max(0,Math.min(1000000,Math.floor(Number(input?.physicalQty)||0)));
  const lowStockThreshold=Math.max(0,Math.min(100000,Math.floor(Number(input?.lowStockThreshold)||0)));
  const reason=clean(input?.reason,500)||"Ajustement manuel";
  const actor=clean(input?.actorLabel,180)||"Admin LHAWTA";

  const changed=await sql.query(
    "WITH previous AS (SELECT id,physical_qty,reserved_qty FROM lhawta_inventory WHERE id=$1::uuid FOR UPDATE), updated AS (UPDATE lhawta_inventory i SET physical_qty=$2,low_stock_threshold=$3,updated_at=now() FROM previous p WHERE i.id=p.id AND $2>=p.reserved_qty RETURNING i.id,i.physical_qty,p.physical_qty AS old_physical), movement AS (INSERT INTO lhawta_inventory_movements (id,inventory_id,movement_type,physical_delta,actor_label,reason) SELECT gen_random_uuid(),u.id,'ADJUST',u.physical_qty-u.old_physical,$4,$5 FROM updated u WHERE u.physical_qty<>u.old_physical RETURNING id) SELECT id::text AS id FROM updated",
    [id,physicalQty,lowStockThreshold,actor,reason]
  ) as Array<{id:string}>;

  if(!changed[0]){
    const exists=await sql.query("SELECT reserved_qty AS \"reservedQty\" FROM lhawta_inventory WHERE id=$1::uuid LIMIT 1",[id]) as Array<{reservedQty:number}>;
    if(exists[0]&&physicalQty<exists[0].reservedQty) throw new Error("PHYSICAL_BELOW_RESERVED");
    return null;
  }

  const rows=await sql.query(
    "SELECT id::text AS id,slug,brand,product_name AS \"productName\",variant,color,physical_qty AS \"physicalQty\",reserved_qty AS \"reservedQty\",sold_qty AS \"soldQty\",GREATEST(physical_qty-reserved_qty,0) AS \"availableQty\",low_stock_threshold AS \"lowStockThreshold\",(physical_qty-reserved_qty)<=low_stock_threshold AS \"lowStock\",updated_at::text AS \"updatedAt\" FROM lhawta_inventory WHERE id=$1::uuid LIMIT 1",
    [id]
  ) as InventoryRow[];

  return rows[0]||null;
}
