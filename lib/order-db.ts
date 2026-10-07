import { neon } from "@neondatabase/serverless";
import { storeProducts } from "@/lib/store-products";
import { getCatalogProductBySlug } from "@/lib/category-catalogs";

export const ORDER_STATUSES=["NOUVEAU","CONFIRME","EXPEDIE","LIVRE","ANNULE"] as const;
export type OrderStatus=typeof ORDER_STATUSES[number];

const ORDER_TRANSITIONS:Record<OrderStatus,readonly OrderStatus[]>={
  NOUVEAU:["CONFIRME","ANNULE"],
  CONFIRME:["EXPEDIE","ANNULE"],
  EXPEDIE:["LIVRE","ANNULE"],
  LIVRE:[],
  ANNULE:[],
};

export function canTransitionOrderStatus(current:OrderStatus,next:OrderStatus){
  return current===next||ORDER_TRANSITIONS[current].includes(next);
}

export type OrderItemInput={
  slug:string;
  variant:string;
  color:string;
  qty:number;
};

export type CreateOrderInput={
  customer:{
    name:string;
    phone:string;
    city:string;
    address:string;
    note?:string;
  };
  items:OrderItemInput[];
};

export type SavedOrderItem={
  id:string;
  slug:string;
  brand:string;
  name:string;
  variant:string;
  color:string;
  quantity:number;
  unitPriceMad:number;
  lineTotalMad:number;
};

export type OrderEvent={
  id:string;
  status:OrderStatus;
  previousStatus:OrderStatus|null;
  actorType:"SYSTEM"|"ADMIN";
  actorLabel:string|null;
  createdAt:string;
};

export type SavedOrder={
  id:string;
  orderNumber:string;
  status:OrderStatus;
  customerName:string;
  phone:string;
  city:string;
  address:string;
  note:string|null;
  subtotalMad:number;
  shippingMad:number;
  totalMad:number;
  paymentMethod:string;
  source:string;
  createdAt:string;
  updatedAt:string;
  items:SavedOrderItem[];
  events:OrderEvent[];
};

function moneyToMad(value:string){
  const parsed=Number(value.replace(/[^0-9]/g,""));
  return Number.isFinite(parsed)?parsed:0;
}

function clean(value:unknown,max=500){
  return typeof value==="string"?value.trim().slice(0,max):"";
}

let sqlClient:ReturnType<typeof neon>|null=null;
let schemaPromise:Promise<void>|null=null;

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) throw new Error("DATABASE_URL_NOT_CONFIGURED");
  if(!sqlClient) sqlClient=neon(url);
  return sqlClient;
}

export function isOrderDatabaseConfigured(){
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureOrderSchema(){
  if(schemaPromise) return schemaPromise;

  schemaPromise=(async()=>{
    const sql=db();
    await sql.query("CREATE SEQUENCE IF NOT EXISTS lhawta_order_seq START WITH 1001");
    await sql.query("CREATE TABLE IF NOT EXISTS lhawta_orders (id uuid PRIMARY KEY, order_number text NOT NULL UNIQUE, status text NOT NULL DEFAULT 'NOUVEAU' CHECK (status IN ('NOUVEAU','CONFIRME','EXPEDIE','LIVRE','ANNULE')), customer_name text NOT NULL, phone text NOT NULL, city text NOT NULL, address text NOT NULL, note text, subtotal_mad integer NOT NULL CHECK (subtotal_mad >= 0), shipping_mad integer NOT NULL DEFAULT 0 CHECK (shipping_mad >= 0), total_mad integer NOT NULL CHECK (total_mad >= 0), payment_method text NOT NULL DEFAULT 'COD', source text NOT NULL DEFAULT 'WHATSAPP', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())");
    await sql.query("CREATE TABLE IF NOT EXISTS lhawta_order_items (id uuid PRIMARY KEY, order_id uuid NOT NULL REFERENCES lhawta_orders(id) ON DELETE CASCADE, slug text NOT NULL, brand text NOT NULL, product_name text NOT NULL, variant text NOT NULL, color text NOT NULL, quantity integer NOT NULL CHECK (quantity > 0), unit_price_mad integer NOT NULL CHECK (unit_price_mad >= 0), line_total_mad integer NOT NULL CHECK (line_total_mad >= 0), created_at timestamptz NOT NULL DEFAULT now())");
    await sql.query("CREATE TABLE IF NOT EXISTS lhawta_order_events (id uuid PRIMARY KEY, order_id uuid NOT NULL REFERENCES lhawta_orders(id) ON DELETE CASCADE, status text NOT NULL CHECK (status IN ('NOUVEAU','CONFIRME','EXPEDIE','LIVRE','ANNULE')), previous_status text CHECK (previous_status IS NULL OR previous_status IN ('NOUVEAU','CONFIRME','EXPEDIE','LIVRE','ANNULE')), actor_type text NOT NULL DEFAULT 'SYSTEM' CHECK (actor_type IN ('SYSTEM','ADMIN')), actor_label text, created_at timestamptz NOT NULL DEFAULT now())");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_orders_created_at_idx ON lhawta_orders (created_at DESC)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_orders_phone_idx ON lhawta_orders (phone)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_order_items_order_id_idx ON lhawta_order_items (order_id)");
    await sql.query("CREATE INDEX IF NOT EXISTS lhawta_order_events_order_id_created_at_idx ON lhawta_order_events (order_id, created_at ASC)");
    await sql.query("INSERT INTO lhawta_order_events (id,order_id,status,previous_status,actor_type,actor_label,created_at) SELECT gen_random_uuid(),o.id,o.status,NULL,'SYSTEM','Historique initial',o.created_at FROM lhawta_orders o WHERE NOT EXISTS (SELECT 1 FROM lhawta_order_events e WHERE e.order_id=o.id)");
  })();

  try{
    await schemaPromise;
  }catch(error){
    schemaPromise=null;
    throw error;
  }
}

function validateOrderInput(input:CreateOrderInput){
  const customer={
    name:clean(input?.customer?.name,120),
    phone:clean(input?.customer?.phone,40),
    city:clean(input?.customer?.city,100),
    address:clean(input?.customer?.address,500),
    note:clean(input?.customer?.note,700),
  };

  if(!customer.name||!customer.phone||!customer.city||!customer.address){
    throw new Error("CUSTOMER_FIELDS_REQUIRED");
  }

  if(!Array.isArray(input?.items)||input.items.length<1||input.items.length>25){
    throw new Error("INVALID_ORDER_ITEMS");
  }

  const items=input.items.map(raw=>{
    const slug=clean(raw.slug,120);
    const product=storeProducts[slug];
    const catalogProduct=product?null:getCatalogProductBySlug(slug);

    if(!product&&!catalogProduct) throw new Error("UNKNOWN_PRODUCT");

    const qty=Math.max(1,Math.min(20,Math.floor(Number(raw.qty)||1)));
    const variant=clean(raw.variant,120);
    const color=clean(raw.color,120);

    if(product){
      if(!product.variants.includes(variant)) throw new Error("INVALID_VARIANT");
      if(!product.colors.includes(color)) throw new Error("INVALID_COLOR");

      const unitPriceMad=moneyToMad(product.price);
      if(unitPriceMad<=0) throw new Error("INVALID_PRODUCT_PRICE");

      return {
        id:crypto.randomUUID(),
        slug:product.slug,
        brand:product.brand,
        name:product.name,
        variant,
        color,
        quantity:qty,
        unitPriceMad,
        lineTotalMad:unitPriceMad*qty,
      };
    }

    if(!catalogProduct) throw new Error("UNKNOWN_PRODUCT");
    const safeVariant=variant||"Standard";
    const safeColor=color||"Standard";
    if(safeVariant!=="Standard") throw new Error("INVALID_VARIANT");
    if(safeColor!=="Standard") throw new Error("INVALID_COLOR");

    const unitPriceMad=moneyToMad(catalogProduct.price);
    if(unitPriceMad<=0) throw new Error("INVALID_PRODUCT_PRICE");

    return {
      id:crypto.randomUUID(),
      slug:catalogProduct.productSlug,
      brand:catalogProduct.brand,
      name:catalogProduct.name,
      variant:safeVariant,
      color:safeColor,
      quantity:qty,
      unitPriceMad,
      lineTotalMad:unitPriceMad*qty,
    };
  });

  return {customer,items};
}

export async function createOrder(input:CreateOrderInput):Promise<SavedOrder>{
  await ensureOrderSchema();
  const sql=db();
  const validated=validateOrderInput(input);

  const orderId=crypto.randomUUID();
  const subtotalMad=validated.items.reduce((sum,item)=>sum+item.lineTotalMad,0);
  const shippingMad=0;
  const totalMad=subtotalMad+shippingMad;

  const itemJson=JSON.stringify(validated.items);
  const eventId=crypto.randomUUID();
  const result=await sql.query(
    "WITH new_order AS ("+
    " INSERT INTO lhawta_orders (id, order_number, status, customer_name, phone, city, address, note, subtotal_mad, shipping_mad, total_mad, payment_method, source)"+
    " VALUES ($1::uuid, 'LHW-' || EXTRACT(YEAR FROM now())::int::text || '-' || lpad(nextval('lhawta_order_seq')::text,5,'0'), 'NOUVEAU', $2,$3,$4,$5,$6,$7,$8,$9,'COD','WHATSAPP')"+
    " RETURNING id::text AS id, order_number AS \"orderNumber\""+
    "), item_data AS ("+
    " SELECT * FROM jsonb_to_recordset($10::jsonb) AS x(id uuid, slug text, brand text, name text, variant text, color text, quantity integer, \"unitPriceMad\" integer, \"lineTotalMad\" integer)"+
    "), inserted_items AS ("+
    " INSERT INTO lhawta_order_items (id, order_id, slug, brand, product_name, variant, color, quantity, unit_price_mad, line_total_mad)"+
    " SELECT x.id, n.id::uuid, x.slug, x.brand, x.name, x.variant, x.color, x.quantity, x.\"unitPriceMad\", x.\"lineTotalMad\" FROM item_data x CROSS JOIN new_order n"+
    " RETURNING id"+
    "), inserted_event AS ("+
    " INSERT INTO lhawta_order_events (id,order_id,status,previous_status,actor_type,actor_label)"+
    " SELECT $11::uuid,n.id::uuid,'NOUVEAU',NULL,'SYSTEM','Commande créée' FROM new_order n RETURNING id"+
    ") SELECT n.id, n.\"orderNumber\", (SELECT count(*)::int FROM inserted_items) AS \"itemCount\" FROM new_order n CROSS JOIN inserted_event",
    [
      orderId,
      validated.customer.name,
      validated.customer.phone,
      validated.customer.city,
      validated.customer.address,
      validated.customer.note||null,
      subtotalMad,
      shippingMad,
      totalMad,
      itemJson,
      eventId,
    ]
  ) as Array<{id:string;orderNumber:string;itemCount:number}>;

  if(!result[0]||result[0].itemCount!==validated.items.length){
    throw new Error("ORDER_CREATE_FAILED");
  }

  const order=await getOrderById(orderId);
  if(!order) throw new Error("ORDER_CREATE_FAILED");
  return order;
}

export async function getOrderById(id:string):Promise<SavedOrder|null>{
  await ensureOrderSchema();
  const sql=db();

  const orders=await sql.query(
    "SELECT id::text AS id, order_number AS \"orderNumber\", status, customer_name AS \"customerName\", phone, city, address, note, subtotal_mad AS \"subtotalMad\", shipping_mad AS \"shippingMad\", total_mad AS \"totalMad\", payment_method AS \"paymentMethod\", source, created_at::text AS \"createdAt\", updated_at::text AS \"updatedAt\" FROM lhawta_orders WHERE id=$1::uuid LIMIT 1",
    [id]
  ) as Array<Omit<SavedOrder,"items"|"events">>;

  if(!orders[0]) return null;

  const items=await sql.query(
    "SELECT id::text AS id, slug, brand, product_name AS name, variant, color, quantity, unit_price_mad AS \"unitPriceMad\", line_total_mad AS \"lineTotalMad\" FROM lhawta_order_items WHERE order_id=$1::uuid ORDER BY created_at ASC",
    [id]
  ) as SavedOrderItem[];

  const events=await sql.query(
    "SELECT id::text AS id, status, previous_status AS \"previousStatus\", actor_type AS \"actorType\", actor_label AS \"actorLabel\", created_at::text AS \"createdAt\" FROM lhawta_order_events WHERE order_id=$1::uuid ORDER BY created_at ASC, id ASC",
    [id]
  ) as OrderEvent[];

  return {...orders[0],items,events};
}

export async function listOrders(options?:{
  search?:string;
  status?:OrderStatus|"ALL";
  limit?:number;
}):Promise<SavedOrder[]>{
  await ensureOrderSchema();
  const sql=db();
  const search=clean(options?.search,120);
  const status=options?.status&&options.status!=="ALL"?options.status:null;
  const limit=Math.max(1,Math.min(200,options?.limit||100));

  const rows=await sql.query(
    "SELECT id::text AS id, order_number AS \"orderNumber\", status, customer_name AS \"customerName\", phone, city, address, note, subtotal_mad AS \"subtotalMad\", shipping_mad AS \"shippingMad\", total_mad AS \"totalMad\", payment_method AS \"paymentMethod\", source, created_at::text AS \"createdAt\", updated_at::text AS \"updatedAt\" FROM lhawta_orders WHERE ($1='' OR order_number ILIKE $2 OR customer_name ILIKE $2 OR phone ILIKE $2 OR city ILIKE $2) AND ($3::text IS NULL OR status=$3) ORDER BY created_at DESC LIMIT $4",
    [search,"%"+search+"%",status,limit]
  ) as Array<Omit<SavedOrder,"items"|"events">>;

  if(!rows.length) return [];

  return Promise.all(rows.map(async row=>{
    const items=await sql.query(
      "SELECT id::text AS id, slug, brand, product_name AS name, variant, color, quantity, unit_price_mad AS \"unitPriceMad\", line_total_mad AS \"lineTotalMad\" FROM lhawta_order_items WHERE order_id=$1::uuid ORDER BY created_at ASC",
      [row.id]
    ) as SavedOrderItem[];
    const events=await sql.query(
      "SELECT id::text AS id, status, previous_status AS \"previousStatus\", actor_type AS \"actorType\", actor_label AS \"actorLabel\", created_at::text AS \"createdAt\" FROM lhawta_order_events WHERE order_id=$1::uuid ORDER BY created_at ASC, id ASC",
      [row.id]
    ) as OrderEvent[];
    return {...row,items,events};
  }));
}

export async function getOrderByNumberAndPhone(orderNumber:string,phone:string):Promise<SavedOrder|null>{
  await ensureOrderSchema();
  const sql=db();
  const number=clean(orderNumber,80).toUpperCase();
  const normalizedPhone=clean(phone,40).replace(/\D/g,"");

  if(!number||normalizedPhone.length<8) return null;

  const rows=await sql.query(
    "SELECT id::text AS id FROM lhawta_orders WHERE upper(order_number)=$1 AND regexp_replace(phone,'[^0-9]','','g')=$2 LIMIT 1",
    [number,normalizedPhone]
  ) as Array<{id:string}>;

  if(!rows[0]) return null;
  return getOrderById(rows[0].id);
}

export async function listCustomerOrdersByVerifiedOrder(orderNumber:string,phone:string):Promise<SavedOrder[]>{
  const verified=await getOrderByNumberAndPhone(orderNumber,phone);
  if(!verified) return [];

  await ensureOrderSchema();
  const sql=db();
  const normalizedPhone=clean(phone,40).replace(/\D/g,"");

  const rows=await sql.query(
    "SELECT id::text AS id FROM lhawta_orders WHERE regexp_replace(phone,'[^0-9]','','g')=$1 ORDER BY created_at DESC LIMIT 100",
    [normalizedPhone]
  ) as Array<{id:string}>;

  const orders=await Promise.all(rows.map(row=>getOrderById(row.id)));
  return orders.filter((order):order is SavedOrder=>Boolean(order));
}

export async function updateOrderStatus(
  id:string,
  status:OrderStatus,
  actorLabel:string|null
):Promise<SavedOrder|null>{
  if(!ORDER_STATUSES.includes(status)) throw new Error("INVALID_STATUS");
  await ensureOrderSchema();
  const sql=db();

  const current=await getOrderById(id);
  if(!current) return null;
  if(!canTransitionOrderStatus(current.status,status)) throw new Error("INVALID_STATUS_TRANSITION");
  if(current.status===status) return current;

  const eventId=crypto.randomUUID();
  const actor=clean(actorLabel,180)||"Admin LHAWTA";
  const changed=await sql.query(
    "WITH current AS ("+
    " SELECT status FROM lhawta_orders WHERE id=$2::uuid FOR UPDATE"+
    "), updated AS ("+
    " UPDATE lhawta_orders SET status=$1, updated_at=now() WHERE id=$2::uuid AND EXISTS (SELECT 1 FROM current) RETURNING id"+
    "), event AS ("+
    " INSERT INTO lhawta_order_events (id,order_id,status,previous_status,actor_type,actor_label)"+
    " SELECT $3::uuid,$2::uuid,$1,current.status,'ADMIN',$4 FROM current CROSS JOIN updated RETURNING id"+
    ") SELECT updated.id::text AS id FROM updated CROSS JOIN event",
    [status,id,eventId,actor]
  ) as Array<{id:string}>;

  if(!changed[0]) return null;
  return getOrderById(id);
}
