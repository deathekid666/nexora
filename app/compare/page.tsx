import ComparePageClient from "@/components/ComparePageClient";

export default async function ComparePage({
  searchParams,
}:{
  searchParams:Promise<{products?:string|string[]}>;
}){
  const query=await searchParams;
  const raw=Array.isArray(query.products)?query.products[0]:query.products;
  const initialSlugs=(raw||"")
    .split(",")
    .map(v=>v.trim())
    .filter(Boolean)
    .slice(0,2);

  return <ComparePageClient initialSlugs={initialSlugs}/>;
}
