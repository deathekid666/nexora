import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTS: Record<string, { page: string; fallbacks: string[] }> = {
  "galaxy-s26-ultra": {
    page: "https://www.samsung.com/n_africa/smartphones/galaxy-s26-ultra/",
    fallbacks: [
      "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s948blbamea/gallery/levant-galaxy-s26-ultra-s948-sm-s948blbamea-thumb-549538578"
    ],
  },
  "xiaomi-17t-pro": {
    page: "https://www.mi.com/ma-fr/product/xiaomi-17t-pro/",
    fallbacks: [
      "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-17t-pro/pc/screen01-bg.png"
    ],
  },
  "honor-600": {
    page: "https://www.honor.com/ma/phones/honor-600/",
    fallbacks: [
      "https://www.honor.com/ma/phones/honor-600/"
    ],
  },
  "redmi-note-15-pro-plus-5g": {
    page: "https://www.mi.com/ma-fr/product/redmi-note-15-pro-plus-5g/",
    fallbacks: [
      "https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-15-pro-plus-5g/pc/1e62d6973df9124095c38d8ed31b142a.jpg"
    ],
  },
  "galaxy-tab-s11-ultra": {
    page: "https://www.samsung.com/africa_fr/tablets/galaxy-tab-s/galaxy-tab-s11-ultra-gray-512gb-sm-x936bzaeafa/",
    fallbacks: [
      "https://images.samsung.com/is/image/samsung/p6pim/n_africa/feature/166494293/n_africa-feature--nbsp-548796580"
    ],
  },
  "playstation-5": {
    page: "https://www.playstation.com/fr-fr/ps5.html/",
    fallbacks: [
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24"
    ],
  },
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x2F;", "/")
    .replaceAll("&#47;", "/")
    .replaceAll("&quot;", '"');
}

function absoluteUrl(value: string, page: string) {
  try {
    return new URL(decodeHtml(value), page).toString();
  } catch {
    return "";
  }
}

function addCandidate(list: string[], value: string | undefined, page: string) {
  if (!value) return;
  const resolved = absoluteUrl(value, page);
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
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html))) {
      addCandidate(out, match[1]?.replaceAll("\\/", "/"), page);
    }
  }

  return out;
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

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return null;

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 1500) return null;

  return { bytes, contentType };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = PRODUCTS[slug];

  if (!product) {
    return new NextResponse("Unknown product", { status: 404 });
  }

  const candidates: string[] = [];

  try {
    const pageResponse = await fetch(product.page, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; LHAWTA/1.0)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "fr-MA,fr;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      next: { revalidate: 86400 },
    });

    if (pageResponse.ok) {
      const html = await pageResponse.text();
      candidates.push(...extractCandidates(html, product.page));
    }
  } catch {
    // Keep going with fallbacks.
  }

  candidates.push(...product.fallbacks);

  if (request.nextUrl.searchParams.get("debug") === "1") {
    return NextResponse.json({
      slug,
      page: product.page,
      candidates,
    });
  }

  if (request.nextUrl.searchParams.get("debug") === "deep") {
    try {
      const pageResponse = await fetch(product.page, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; LHAWTA/1.0)",
          accept: "text/html,application/xhtml+xml",
          "accept-language": "fr-MA,fr;q=0.9,en;q=0.8",
        },
        redirect: "follow",
        cache: "no-store",
      });
      const html = await pageResponse.text();
      const urls = Array.from(
        html.matchAll(/https?:\\?\/\\?\/[^"'\\s<>]+/gi),
        (m) => m[0].replaceAll("\\/", "/").replaceAll("&amp;", "&")
      ).filter((u) => /(?:images\.samsung|appmifile|honor\.com\/content|gmedia\.playstation)/i.test(u));
      return NextResponse.json({ slug, urls: [...new Set(urls)].slice(0, 250) });
    } catch (error) {
      return NextResponse.json({ slug, error: String(error) }, { status: 500 });
    }
  }

  for (const candidate of candidates) {
    try {
      const image = await fetchImage(candidate);
      if (!image) continue;

      return new NextResponse(image.bytes, {
        status: 200,
        headers: {
          "Content-Type": image.contentType,
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          "X-Lhawta-Image-Source": new URL(candidate).hostname,
        },
      });
    } catch {
      // Try next candidate.
    }
  }

  return new NextResponse("Product image unavailable", { status: 502 });
}
