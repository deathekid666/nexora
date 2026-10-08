import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {schema,customerDb,hashPassword,verifyPassword,setSession,clearSession,currentCustomer} from "@/lib/customer-auth";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){return NextResponse.json({user:await currentCustomer()})}
export async function DELETE(){await clearSession();return NextResponse.json({ok:true})}
export async function POST(request:NextRequest){
 try{
  const body=await request.json();
  const action=body?.action;
  const email=String(body?.email||"").trim().toLowerCase();
  const password=String(body?.password||"");
  const name=String(body?.name||"").trim().slice(0,100);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8||password.length>128)return NextResponse.json({message:"Email valide et mot de passe de 8 caractères minimum requis."},{status:400});
  await schema();
  const sql=customerDb();
  if(action==="signup"){
   if(name.length<2)return NextResponse.json({message:"Saisissez votre nom complet."},{status:400});
   const rows=await sql.query("INSERT INTO lhawta_customers (id,name,email,password_hash) VALUES ($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING RETURNING id",[randomUUID(),name,email,hashPassword(password)]);
   if(!rows.length)return NextResponse.json({message:"Cet email est déjà utilisé."},{status:409});
   await setSession(String(rows[0].id));
  }else if(action==="login"){
   const rows=await sql.query("SELECT id,password_hash FROM lhawta_customers WHERE email=$1",[email]);
   if(!rows.length||!verifyPassword(password,String(rows[0].password_hash)))return NextResponse.json({message:"Email ou mot de passe incorrect."},{status:401});
   await setSession(String(rows[0].id));
  }else return NextResponse.json({message:"Action inconnue."},{status:400});
  return NextResponse.json({ok:true});
 }catch(error){console.error("[customer auth]",error);return NextResponse.json({message:"Connexion indisponible. Vérifiez la configuration du serveur."},{status:503})}
}
