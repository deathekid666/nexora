const SOURCE =
  "https://raw.githubusercontent.com/timDeHof/timdehof-monorepo/main/apps/web/public/models/smartphone.glb";

export const runtime = "nodejs";

export async function GET() {
  const upstream = await fetch(SOURCE, {
    next: { revalidate: 60 * 60 * 24 },
    headers: {
      Accept: "model/gltf-binary,application/octet-stream,*/*",
    },
  });

  if (!upstream.ok) {
    return new Response("3D model unavailable", { status: 502 });
  }

  const bytes = await upstream.arrayBuffer();

  return new Response(bytes, {
    headers: {
      "Content-Type": "model/gltf-binary",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Length": String(bytes.byteLength),
    },
  });
}
