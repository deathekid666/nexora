import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductSource = {
  page: string;
  preferred: string[];
  keywords: string[];
};

const PRODUCTS: Record<string, ProductSource> = {
  "galaxy-s26-ultra": {
    page: "https://www.samsung.com/n_africa/smartphones/galaxy-s26-ultra/",
    preferred: [
      "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s948blbamea/gallery/levant-galaxy-s26-ultra-s948-sm-s948blbamea-thumb-549538578",
      "https://images.samsung.com/n_africa/smartphones/galaxy-s26-ultra/images/galaxy-s26-ultra-share-image.jpg",
    ],
    keywords: ["s26","s948","galaxy-s26-ultra"],
  },
  "xiaomi-17t-pro": {
    page: "https://www.mi.com/ma-fr/product/xiaomi-17t-pro/",
    preferred: [
      "https://i02.appmifile.com/840_item_ma/22/05/2026/540f65b7d515813e5edc0a5c89b49e56.png",
      "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-17t-pro/pc/screen01-bg.png",
    ],
    keywords: ["xiaomi-17t-pro","17t-pro","17t"],
  },
  "honor-600": {
    page: "https://www.honor.com/ma/phones/honor-600/",
    preferred: [
      "https://www-file.honor.com/content/dam/honor/common/product-list/honor-600-series/honor-600/green.png",
      "https://www.honor.com/content/dam/honor/common/products/honor-600/product/share.jpg",
    ],
    keywords: ["honor-600","honor600","600"],
  },
  "redmi-note-15-pro-plus-5g": {
    page: "https://www.mi.com/ma-fr/product/redmi-note-15-pro-plus-5g/",
    preferred: [
      "https://i02.appmifile.com/933_item_ma/12/01/2026/ceb8ae78992b6f2d26a977ee7005c09a.png",
      "https://i02.appmifile.com/767_item_ma/12/01/2026/85e3236281cd100e1e09010f429025fa.png",
      "https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-15-pro-plus-5g/pc/1e62d6973df9124095c38d8ed31b142a.jpg",
    ],
    keywords: ["redmi-note-15","note-15-pro","15-pro-plus"],
  },
  "galaxy-tab-s11": {
    page: "https://www.samsung.com/uk/tablets/galaxy-tab-s/galaxy-tab-s11-grey-128gb-wi-fi-sm-x730nzareub/",
    preferred: [],
    keywords: ["x730","tab-s11","galaxy-tab-s11"],
  },
  "galaxy-tab-s11-ultra": {
    page: "https://www.samsung.com/africa_fr/tablets/galaxy-tab-s/galaxy-tab-s11-ultra-gray-512gb-sm-x936bzaeafa/",
    preferred: [
      "https://images.samsung.com/is/image/samsung/p6pim/n_africa/feature/166494293/n_africa-feature--nbsp-548796580",
    ],
    keywords: ["x936","tab-s11-ultra","galaxy-tab-s11"],
  },
  "playstation-5": {
    page: "https://www.playstation.com/fr-fr/ps5/",
    preferred: [
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24",
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
    ],
    keywords: ["ps5","playstation-5","playstation5"],
  },
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x2F;", "/")
    .replaceAll("&#47;", "/")
    .replaceAll("&quot;", '"')
    .replaceAll("\\/", "/");
}

function absoluteUrl(value: string, page: string) {
  try {
    if (value.startsWith("//")) return "https:" + value;
    return new URL(decodeHtml(value), page).toString();
  } catch {
    return "";
  }
}

function addCandidate(list: string[], value: string | undefined, page: string) {
  if (!value) return;
  const resolved = absoluteUrl(value.trim(), page);
  if (!resolved || !/^https?:/i.test(resolved)) return;
  if (!list.includes(resolved)) list.push(resolved);
}

function extractCandidates(html: string, page: string) {
  const out: string[] = [];

  const patterns = [
    /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
    /"image"\s*:\s*\[\s*"([^"]+)"/gi,
    /"image"\s*:\s*"([^"]+)"/gi,
    /\b(?:src|data-src|data-src-pc|data-src-mobile|data-original)=["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html))) addCandidate(out, match[1], page);
  }

  return out;
}

function scoreCandidate(url: string, keywords: string[]) {
  const s=url.toLowerCase();
  let score=0;

  for (const keyword of keywords) {
    if (s.includes(keyword.toLowerCase())) score+=24;
  }

  if (s.includes("gallery")) score+=30;
  if (s.includes("front")) score+=24;
  if (s.includes("combo")) score+=18;
  if (s.includes("thumb")) score+=14;
  if (/\.(png|webp|avif)(\?|$)/i.test(s)) score+=6;

  if (s.includes("share")) score-=5;
  if (s.includes("feature")) score-=8;
  if (s.includes("logo")) score-=80;
  if (s.includes("icon")) score-=70;
  if (s.includes("sprite")) score-=70;
  if (s.includes("bazaarvoice")) score-=100;
  if (s.includes("review")) score-=70;

  return score;
}

async function fetchImage(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; LHAWTA/1.0)",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      referer: new URL(url).origin + "/",
    },
    redirect: "follow",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const contentType=response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return null;

  const bytes=await response.arrayBuffer();
  if (bytes.byteLength<1800) return null;

  return { bytes, contentType };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug }=await params;
  const product=PRODUCTS[slug];

  if (!product) return new NextResponse("Unknown product", { status: 404 });

  const discovered:string[]=[];

  try {
    const pageResponse=await fetch(product.page, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; LHAWTA/1.0)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "fr-MA,fr;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      next: { revalidate: 86400 },
    });

    if (pageResponse.ok) {
      const html=await pageResponse.text();
      discovered.push(...extractCandidates(html,product.page));
    }
  } catch {
    // Preferred sources below keep the storefront usable even if discovery fails.
  }

  const ranked=[
    ...product.preferred,
    ...discovered
      .filter(url=>!product.preferred.includes(url))
      .sort((a,b)=>scoreCandidate(b,product.keywords)-scoreCandidate(a,product.keywords)),
  ];

  const requestedView=Math.max(0,Math.min(5,Number.parseInt(request.nextUrl.searchParams.get("view") || "0",10) || 0));
  let validIndex=0;
  let firstValid:{bytes:ArrayBuffer;contentType:string;source:string}|null=null;

  for (const candidate of ranked) {
    try {
      const image=await fetchImage(candidate);
      if (!image) continue;

      if (!firstValid) firstValid={...image,source:candidate};

      if (validIndex===requestedView) {
        return new NextResponse(image.bytes, {
          status: 200,
          headers: {
            "Content-Type": image.contentType,
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
            "X-Lhawta-Image-Source": new URL(candidate).hostname,
            "X-Lhawta-Image-View": String(requestedView),
          },
        });
      }

      validIndex++;
    } catch {
      // Try the next verified candidate.
    }
  }

  if (firstValid) {
    return new NextResponse(firstValid.bytes, {
      status: 200,
      headers: {
        "Content-Type": firstValid.contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "X-Lhawta-Image-Source": new URL(firstValid.source).hostname,
        "X-Lhawta-Image-View": "fallback-0",
      },
    });
  }

  return new NextResponse("Product image unavailable", { status: 502 });
}
