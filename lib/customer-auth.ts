import {neon} from "@neondatabase/serverless";
import {randomBytes,scryptSync,timingSafeEqual,createHmac} from "node:crypto";
import {cookies} from "next/headers";
const key="lhawta_session";
function sql(){if(!process.env.DATABASE_URL)throw Error("DATABASE_NOT_CONFIGURED");return neon(process.env.DATABASE_URL)}
function secret(){const s=process.env.LHAWTA_AUTH_SECRET||process.env.LHAWTA_ADMIN_TOKEN;if(!s||s.length<24)throw Error("AUTH_SECRET_NOT_CONFIGURED");return s}
export async function schema(){await sql().query("CREATE TABLE IF NOT EXISTS lhawta_customers (id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE, password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())")}
export function hashPassword(p:string){const salt=randomBytes(16).toString("hex");return salt+":"+scryptSync(p,salt,64).toString("hex")}
export function verifyPassword(p:string,h:string){const [salt,hex]=h.split(":");if(!salt||!hex||hex.length!==128)return false;return timingSafeEqual(scryptSync(p,salt,64),Buffer.from(hex,"hex"))}
function signature(data:string){return createHmac("sha256",secret()).update(data).digest("hex")}
export async function setSession(id:string){const expires=Date.now()+7*86400000;const data=id+"."+expires;const jar=await cookies();jar.set(key,data+"."+signature(data),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800})}
export async function clearSession(){(await cookies()).delete(key)}
export async function currentCustomer(){try{const token=(await cookies()).get(key)?.value||"";const parts=token.split(".");if(parts.length!==3)return null;const [id,expiry,sig]=parts;const data=id+"."+expiry;const expected=signature(data);if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected))||Number(expiry)<Date.now())return null;const rows=await sql().query("SELECT id,name,email FROM lhawta_customers WHERE id=$1",[id]);return rows[0]||null}catch{return null}}
export function customerDb(){return sql()}
