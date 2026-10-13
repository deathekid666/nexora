import {notFound} from "next/navigation";
import StoreProductDetail from "@/components/StoreProductDetail";
import CatalogProductDetail from "@/components/CatalogProductDetail";
import {featuredProductSlugs,getStoreProduct} from "@/lib/store-products";
import {allCatalogProductSlugs,getCatalogProductBySlug} from "@/lib/category-catalogs";
import {getCustomProductBySlug} from "@/lib/catalog-admin";
export function generateStaticParams(){return [...new Set([...featuredProductSlugs,...allCatalogProductSlugs])].map(slug=>({slug}))}
export const dynamicParams=true;
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const storeProduct=getStoreProduct(slug);
 if(storeProduct)return <StoreProductDetail product={storeProduct}/>;
 const catalogProduct=getCatalogProductBySlug(slug);
 if(catalogProduct)return <CatalogProductDetail product={catalogProduct}/>;
 const customProduct=await getCustomProductBySlug(slug);
 if(customProduct)return <CatalogProductDetail product={customProduct}/>;
 notFound();
}
