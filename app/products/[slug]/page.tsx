import { notFound } from "next/navigation";
import StoreProductDetail from "@/components/StoreProductDetail";
import { featuredProductSlugs, getStoreProduct } from "@/lib/store-products";

export function generateStaticParams(){
  return featuredProductSlugs.map(slug=>({slug}));
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=getStoreProduct(slug);

  if(!product) notFound();

  return <StoreProductDetail product={product}/>;
}
