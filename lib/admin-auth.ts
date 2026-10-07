import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

function secureEqual(a:string,b:string){
  const aa=Buffer.from(a);
  const bb=Buffer.from(b);
  if(aa.length!==bb.length) return false;
  return timingSafeEqual(aa,bb);
}

export function isAdminRequest(request:NextRequest){
  const expected=process.env.LHAWTA_ADMIN_TOKEN||"";
  if(!expected) return false;

  const auth=request.headers.get("authorization")||"";
  const bearer=auth.startsWith("Bearer ")?auth.slice(7).trim():"";
  const header=request.headers.get("x-admin-token")||"";
  const supplied=bearer||header;

  return Boolean(supplied)&&secureEqual(supplied,expected);
}

export function adminTokenConfigured(){
  return Boolean(process.env.LHAWTA_ADMIN_TOKEN);
}
