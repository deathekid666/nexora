import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE="lhawta_admin_session";
const SESSION_MAX_AGE_SECONDS=60*60*12;

function secureEqual(a:string,b:string){
  const aa=Buffer.from(a);
  const bb=Buffer.from(b);
  if(aa.length!==bb.length) return false;
  return timingSafeEqual(aa,bb);
}

function adminSecret(){
  return process.env.LHAWTA_ADMIN_TOKEN||"";
}

export function configuredAdminEmails(){
  return (process.env.LHAWTA_ADMIN_EMAILS||"")
    .split(",")
    .map(value=>value.trim().toLowerCase())
    .filter(Boolean);
}

export function isApprovedAdminEmail(email:string){
  const normalized=email.trim().toLowerCase();
  return Boolean(normalized)&&configuredAdminEmails().includes(normalized);
}

function signSessionPayload(payload:string){
  const secret=adminSecret();
  if(!secret) return "";
  return createHmac("sha256",secret).update(payload).digest("base64url");
}

export function createAdminSession(email:string){
  const normalized=email.trim().toLowerCase();
  if(!isApprovedAdminEmail(normalized)) throw new Error("ADMIN_EMAIL_NOT_ALLOWED");
  const issuedAt=Math.floor(Date.now()/1000);
  const payload=Buffer.from(JSON.stringify({email:normalized,issuedAt}),"utf8").toString("base64url");
  const signature=signSessionPayload(payload);
  if(!signature) throw new Error("ADMIN_AUTH_NOT_CONFIGURED");
  return {
    value:payload+"."+signature,
    maxAge:SESSION_MAX_AGE_SECONDS,
    email:normalized,
  };
}

export function readAdminSession(request:NextRequest){
  const raw=request.cookies.get(ADMIN_SESSION_COOKIE)?.value||"";
  if(!raw) return null;

  const [payload,signature]=raw.split(".");
  if(!payload||!signature) return null;

  const expected=signSessionPayload(payload);
  if(!expected||!secureEqual(signature,expected)) return null;

  try{
    const decoded=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as {
      email?:string;
      issuedAt?:number;
    };
    const email=typeof decoded.email==="string"?decoded.email.trim().toLowerCase():"";
    const issuedAt=Number(decoded.issuedAt)||0;
    const now=Math.floor(Date.now()/1000);

    if(!email||!isApprovedAdminEmail(email)) return null;
    if(!issuedAt||issuedAt>now+60||now-issuedAt>SESSION_MAX_AGE_SECONDS) return null;

    return {email,issuedAt};
  }catch{
    return null;
  }
}

export function verifyAdminCredentials(email:string,accessKey:string){
  const expected=adminSecret();
  return Boolean(
    expected&&
    isApprovedAdminEmail(email)&&
    accessKey&&
    secureEqual(accessKey,expected)
  );
}

export function isAdminRequest(request:NextRequest){
  if(readAdminSession(request)) return true;

  const expected=adminSecret();
  if(!expected) return false;

  const auth=request.headers.get("authorization")||"";
  const bearer=auth.startsWith("Bearer ")?auth.slice(7).trim():"";
  const header=request.headers.get("x-admin-token")||"";
  const supplied=bearer||header;

  return Boolean(supplied)&&secureEqual(supplied,expected);
}

export function adminTokenConfigured(){
  return Boolean(adminSecret()&&configuredAdminEmails().length);
}
