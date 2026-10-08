import {NextRequest,NextResponse} from "next/server";
import {currentCustomer,customerDb,ensureCustomerRoles} from "@/lib/customer-auth";
import {isAdminRequest,adminTokenConfigured} from "@/lib/admin-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

// One-time linking: an authenticated customer must also prove possession of
// the existing administrator secret. An email address alone grants nothing.
export async function POST(request:NextRequest){
  if(!adminTokenConfigured())return NextResponse.json({ok:false,error:"ADMIN_NOT_CONFIGURED"},{status:503});
  const customer=await currentCustomer();
  if(!customer)return NextResponse.json({ok:false,error:"LOGIN_REQUIRED"},{status:401});
  const allowedEmail=(process.env.LHAWTA_ADMIN_EMAIL||"nlaassali1@gmail.com").trim().toLowerCase();
  if(String(customer.email).toLowerCase()!==allowedEmail)return NextResponse.json({ok:false,error:"NOT_ELIGIBLE"},{status:403});
  if(!isAdminRequest(request))return NextResponse.json({ok:false,error:"INVALID_ADMIN_KEY"},{status:403});
  try{
    await ensureCustomerRoles();
    const rows=await customerDb().query("UPDATE lhawta_customers SET is_admin=true WHERE id=$1 AND lower(email)=$2 RETURNING id",[customer.id,allowedEmail]);
    if(!rows.length)return NextResponse.json({ok:false,error:"NOT_ELIGIBLE"},{status:403});
    return NextResponse.json({ok:true,admin:true});
  }catch(error){
    console.error("[admin claim]",error);
    return NextResponse.json({ok:false,error:"ADMIN_LINK_FAILED"},{status:503});
  }
}
