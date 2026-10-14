import {handleUpload,type HandleUploadBody} from "@vercel/blob/client";
import {NextResponse} from "next/server";
import {currentAdminCustomer} from "@/lib/customer-auth";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const ALLOWED_TYPES=["image/jpeg","image/png","image/webp","image/avif"];
const MAX_FILE_SIZE=5*1024*1024;

export async function POST(request:Request){
  let body:HandleUploadBody;
  try{body=await request.json() as HandleUploadBody;}
  catch{return NextResponse.json({error:"Invalid upload request."},{status:400});}

  try{
    const response=await handleUpload({
      body,
      request,
      onBeforeGenerateToken:async(pathname)=>{
        if(!await currentAdminCustomer())throw new Error("UNAUTHORIZED");
        if(!/^products\/[a-f0-9-]{36}-[A-Za-z0-9._-]{1,100}$/i.test(pathname))throw new Error("INVALID_UPLOAD_PATH");
        return {
          allowedContentTypes:ALLOWED_TYPES,
          maximumSizeInBytes:MAX_FILE_SIZE,
          addRandomSuffix:true,
          tokenPayload:JSON.stringify({scope:"catalog-product"}),
        };
      },
      onUploadCompleted:async()=>{},
    });
    return NextResponse.json(response);
  }catch{
    return NextResponse.json({error:"Upload denied. Sign in as an administrator and use a supported image under 5 MB."},{status:400});
  }
}
