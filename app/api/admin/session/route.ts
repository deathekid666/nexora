import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminTokenConfigured,
  createAdminSession,
  readAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  if(!adminTokenConfigured()){
    return NextResponse.json({ok:false,error:"ADMIN_AUTH_NOT_CONFIGURED"},{status:503});
  }

  const session=readAdminSession(request);
  if(!session){
    return NextResponse.json({ok:false,error:"UNAUTHORIZED"},{status:401});
  }

  return NextResponse.json({ok:true,email:session.email});
}

export async function POST(request:NextRequest){
  if(!adminTokenConfigured()){
    return NextResponse.json({ok:false,error:"ADMIN_AUTH_NOT_CONFIGURED"},{status:503});
  }

  const body=await request.json().catch(()=>({}));
  const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
  const accessKey=typeof body?.accessKey==="string"?body.accessKey:"";

  if(!verifyAdminCredentials(email,accessKey)){
    return NextResponse.json(
      {ok:false,error:"INVALID_ADMIN_CREDENTIALS",message:"Email ou clé admin incorrect."},
      {status:401}
    );
  }

  const session=createAdminSession(email);
  const response=NextResponse.json({ok:true,email:session.email});
  response.cookies.set(ADMIN_SESSION_COOKIE,session.value,{
    httpOnly:true,
    secure:true,
    sameSite:"lax",
    path:"/",
    maxAge:session.maxAge,
  });
  return response;
}

export async function DELETE(){
  const response=NextResponse.json({ok:true});
  response.cookies.set(ADMIN_SESSION_COOKIE,"",{
    httpOnly:true,
    secure:true,
    sameSite:"lax",
    path:"/",
    maxAge:0,
  });
  return response;
}
