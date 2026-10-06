import { Pool } from "@neondatabase/serverless";
import { storeProducts } from "@/lib/store-products";

export const ORDER_STATUSES=["NOUVEAU","CONFIRME","EXPEDIE","LIVRE","ANNULE"] as const;
export type OrderStatus=typeof ORDER_STATUSES[number];

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
};

function moneyToMad(value:string){
  const parsed=Number(value.replace(/[^0-9]/g,""));
  return Number.isFinite(parsed)?parsed:0;
}

function clean(value:unknown,max=500){
  return typeof value==="string"?value.trim().slice(0,max):"";
}

let pool:Pool|null=null;
let schemaPromise:Promise<void>|null=null;

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) throw new Error("DATABASE_URL_NOT_CONFIGURED");
  if(!pool) pool=new Pool({connectionString:url});
  return pool;
}

export function isOrderDatabaseConfigured(){
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureOrderSchema(){
  if(schemaPromise) return schemaPromise;
  schemaPromise=(async()=>{
    const client=db();
    await client.query("CREATE SEQUENCE IF NOT EXISTS lhawta_order_seq START WITH 1001");
    await client.query("CREATE TABLE IF NOT EXISTS lhawta_orders (id uuid PRIMARY KEY, order_number text NOT NULL UNIQUE, status text NOT NULL DEFAULT 'NOUVEAU' CHECK (status IN ('NOUVEAU','CONFIRME','EXPEDIE','LIVRE','ANNULE')), customer_name text NOT NULL, phone text NOT NULL, city text NOT NULL, address text NOT NULL, note text, subtotal_mad integer NOT NULL CHECK (subtotal_mad >= 0), shipping_mad integer NOT NULL DEFAULT 0 CHECK (shipping_mad >= 0), total_mad integer NOT NULL CHECK (total_mad >= 0), payment_method text NOT NULL DEFAULT 'COD', source text NOT NULL DEFAULT 'WHATSAPP', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())");
    await client.query("CREATE TABLE IF NOT EXISTS lhawta_order_items (id uuid PRIMARY KEY, order_id uuid NOT NULL REFERENCES lhawta_orders(id) ON DELETE CASCADE, slug text NOT NULL, brand text NOT NULL, product_name text NOT NULL, variant text NOT NULL, color text NOT NULL, quantity integer NOT NULL CHECK (quantity > 0), unit_price_mad integer NOT NULL CHECK (unit_price_mad >= 0), line_total_mad integer NOT NULL CHECK (line_total_mad >= 0), created_at timestamptz NOT NULL DEFAULT now())");
    await client.query("CREATE INDEX IF NOT EXISTS lhawta_orders_created_at_idx ON lhawta_orders (created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS lhawta_orders_phone_idx ON lhawta_orders (phone)");
    await client.query("CREATE INDEX IF NOT EXISTS lhawta_order_items_order_id_idx ON lhawta_order_items (order_id)");
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
    const product=storeProducts[clean(raw.slug,120)];
    if(!product) throw new Error("UNKNOWN_PRODUCT");

    const qty=Math.max(1,Math.min(20,Math.floor(Number(raw.qty)||1)));
    const variant=clean(raw.variant,120);
    const color=clean(raw.color,120);

    if(!product.variants.includes(variant)) throw new Error("INVALID_VARIANT");
    if(!product.colors.includes(color)) throw new Error("INVALID_COLOR");

    const unitPriceMad=moneyToMad(product.price);
    if(unitPriceMad<=0) throw new Error("INVALID_PRODUCT_PRICE");

    return {
      slug:product.slug,
      brand:product.brand,
      name:product.name,
      variant,
      color,
      quantity:qty,
      unitPriceMad,
      lineTotalMad:unitPriceMad*qty,
    };
  });

  return {customer,items};
}

export async function createOrder(input:CreateOrderInput):Promise<SavedOrder>{
  await ensureOrderSchema();
  const client=db();
  const validated=validateOrderInput(input);

  const seqResult=await client.query<{seq:string}>("SELECT nextval('lhawta_order_seq')::bigint::text AS seq");
  const seq=seqResult.rows[0]?.seq;
  if(!seq) throw new Error("ORDER_SEQUENCE_FAILED");

  const year=new Date().getUTCFullYear();
  const orderNumber="LHW-"+year+"-"+String(seq).padStart(5,"0");
  const orderId=crypto.randomUUID();
  const subtotalMad=validated.items.reduce((sum,item)=>sum+item.lineTotalMad,0);
  const shippingMad=0;
  const totalMad=subtotalMad+shippingMad;

  const connection=await client.connect();
  try{
    await connection.query("BEGIN");
    await connection.query(
      "INSERT INTO lhawta_orders (id, order_number, status, customer_name, phone, city, address, note, subtotal_mad, shipping_mad, total_mad, payment_method, source) VALUES ($1::uuid,$2,'NOUVEAU',$3,$4,$5,$6,$7,$8,$9,$10,'COD','WHATSAPP')",
      [orderId,orderNumber,validated.customer.name,validated.customer.phone,validated.customer.city,validated.customer.address,validated.customer.note||null,subtotalMad,shippingMad,totalMad]
    );

    for(const item of validated.items){
      await connection.query(
        "INSERT INTO lhawta_order_items (id, order_id, slug, brand, product_name, variant, color, quantity, unit_price_mad, line_total_mad) VALUES ($1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8,$9,$10)",
        [crypto.randomUUID(),orderId,item.slug,item.brand,item.name,item.variant,item.color,item.quantity,item.unitPriceMad,item.lineTotalMad]
      );
    }
    await connection.query("COMMIT");
  }catch(error){
    await connection.query("ROLLBACK");
    throw error;
  }finally{
    connection.release();
  }

  const order=await getOrderById(orderId);
  if(!order) throw new Error("ORDER_CREATE_FAILED");
  return order;
}

export async function getOrderById(id:string):Promise<SavedOrder|null>{
  await ensureOrderSchema();
  const client=db();

  const orderResult=await client.query<Omit<SavedOrder,"items">>(
    "SELECT id::text AS id, order_number AS \"orderNumber\", status, customer_name AS \"customerName\", phone, city, address, note, subtotal_mad AS \"subtotalMad\", shipping_mad AS \"shippingMad\", total_mad AS \"totalMad\", payment_method AS \"paymentMethod\", source, created_at::text AS \"createdAt\", updated_at::text AS \"updatedAt\" FROM lhawta_orders WHERE id=$1::uuid LIMIT 1",
    [id]
  );
  if(!orderResult.rows[0]) return null;

  const itemResult=await client.query<SavedOrderItem>(
    "SELECT id::text AS id, slug, brand, product_name AS name, variant, color, quantity, unit_price_mad AS \"unitPriceMad\", line_total_mad AS \"lineTotalMad\" FROM lhawta_order_items WHERE order_id=$1::uuid ORDER BY created_at ASC",
    [id]
  );

  return {...orderResult.rows[0],items:itemResult.rows};
}

export async function listOrders(options?:{
  search?:string;
  status?:OrderStatus|"ALL";
  limit?:number;
}):Promise<SavedOrder[]>{
  await ensureOrderSchema();
  const client=db();
  const search=clean(options?.search,120);
  const status=options?.status&&options.status!=="ALL"?options.status:null;
  const limit=Math.max(1,Math.min(200,options?.limit||100));

  const result=await client.query<Omit<SavedOrder,"items">>(
    "SELECT id::text AS id, order_number AS \"orderNumber\", status, customer_name AS \"customerName\", phone, city, address, note, subtotal_mad AS \"subtotalMad\", shipping_mad AS \"shippingMad\", total_mad AS \"totalMad\", payment_method AS \"paymentMethod\", source, created_at::text AS \"createdAt\", updated_at::text AS \"updatedAt\" FROM lhawta_orders WHERE ($1='' OR order_number ILIKE $2 OR customer_name ILIKE $2 OR phone ILIKE $2 OR city ILIKE $2) AND ($3::text IS NULL OR status=$3) ORDER BY created_at DESC LIMIT $4",
    [search,"%"+search+"%",status,limit]
  );

  if(!result.rows.length) return [];
  const orders=await Promise.all(result.rows.map(async row=>{
    const itemResult=await client.query<SavedOrderItem>(
      "SELECT id::text AS id, slug, brand, product_name AS name, variant, color, quantity, unit_price_mad AS \"unitPriceMad\", line_total_mad AS \"lineTotalMad\" FROM lhawta_order_items WHERE order_id=$1::uuid ORDER BY created_at ASC",
      [row.id]
    );
    return {...row,items:itemResult.rows};
  }));
  return orders;
}

export async function updateOrderStatus(id:string,status:OrderStatus):Promise<SavedOrder|null>{
  if(!ORDER_STATUSES.includes(status)) throw new Error("INVALID_STATUS");
  await ensureOrderSchema();
  const client=db();

  const result=await client.query<{id:string}>(
    "UPDATE lhawta_orders SET status=$1, updated_at=now() WHERE id=$2::uuid RETURNING id::text AS id",
    [status,id]
  );
  if(!result.rows[0]) return null;
  return getOrderById(id);
}
