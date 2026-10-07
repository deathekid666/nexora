import { NextResponse } from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const HERO_SOURCES:Record<string,string>={
  "galaxy-s26-ultra":"https://api.samsungmobilepress.com/api/v1/file/F0079F4C3B320974850EA001FDD3463F37B966748BDE494FE62748327134D1DCE64158DC226213A89FED047E03845F28FF11247D0F5F079675A5BA7EC119A8674E479D8C6611F18CA1274AB23544EAD1D59F28A1AE5591ADDC088A2826AA2F0B97EDE750BCA1D4633D188D39711E6B63A0AF87D47190E94DC73815539D17511B3AB052BB115C35872B3F0EAC1BAD3CFD",
  "xiaomi-17t-pro":"https://i02.appmifile.com/840_item_ma/22/05/2026/540f65b7d515813e5edc0a5c89b49e56.png",
  "honor-600":"https://www-file.honor.com/content/dam/honor/common/products/honor-600/product/imgs/section-cmf/honor600series-cmf-icon-orange.png",
  "redmi-note-15-pro-plus-5g":"https://cdn.mtscdn.ru/upload/iblock/2a4/3102_2660.png",
  "galaxy-tab-s11-ultra":"https://api.samsungmobilepress.com/api/v1/file/9AD4BF6CF331B23918D7686EC6492EF34CDEB735D3DA9F5FAB2BE857DC59952F4B93C5CA218324473BA90BB15D54BDB505A054C5700B8B15A9F78D8FAAA317860914EA7B24CA899EE8FDCF4B4DD3AC1F853537A1F8140B45627ABD76C84638A5E0C64D7FA13952E8051D5F7DCD635F4E1C2B8025E3179AE65C9670D751C1D5952931893E5ED0CFA9AA982A3D36A4CB7D",
  "playstation-5":"https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24",
};

export async function GET(
  _request:Request,
  {params}:{params:Promise<{slug:string}>}
){
  const {slug}=await params;
  const source=HERO_SOURCES[slug];
  if(!source) return new NextResponse("Unknown hero product",{status:404});

  try{
    const response=await fetch(source,{
      headers:{
        "user-agent":"Mozilla/5.0 (compatible; LHAWTA/1.0)",
        accept:"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer:new URL(source).origin+"/",
      },
      redirect:"follow",
      cache:"force-cache",
    });

    if(!response.ok) return new NextResponse("Hero asset unavailable",{status:502});

    const contentType=response.headers.get("content-type")||"image/png";
    if(!contentType.startsWith("image/")) return new NextResponse("Invalid hero asset",{status:502});

    const bytes=await response.arrayBuffer();
    if(bytes.byteLength<1500) return new NextResponse("Hero asset too small",{status:502});

    return new NextResponse(bytes,{
      status:200,
      headers:{
        "Content-Type":contentType,
        "Cache-Control":"public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "X-Lhawta-Hero-Source":new URL(source).hostname,
      },
    });
  }catch{
    return new NextResponse("Hero asset unavailable",{status:502});
  }
}
