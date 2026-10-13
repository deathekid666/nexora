import {notFound} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import CategoryCatalogClient from "@/components/CategoryCatalogClient";
import {catalogs,productDetailSlugs} from "@/lib/category-catalogs";
import {listCustomProducts,listDisabledBuiltInSlugs} from "@/lib/catalog-admin";
export function generateStaticParams(){return Object.keys(catalogs).map(slug=>({slug}))}
export const dynamic="force-dynamic";
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const category=catalogs[slug];if(!category)notFound();
 const disabled=await listDisabledBuiltInSlugs();
 const visibleBuiltIns=category.products.filter(product=>{const detailSlug=Object.entries(productDetailSlugs).find(([,name])=>name===product.name)?.[0];return !detailSlug||!disabled.includes(detailSlug)});
 const customProducts=(await listCustomProducts()).filter(product=>product.categorySlug===slug);
 return <main className="lhawta-sketch-site category-page"><SiteMotion/><StoreHeader/>
 <section className="category-hero"><div><a href="/" className="category-back"><ArrowLeft size={15}/> Accueil</a><span>{category.eyebrow}</span><h1>{category.title}</h1><p>{category.copy}</p></div><aside><small>CATÉGORIE</small><strong>{category.accent}</strong><span>{visibleBuiltIns.length+customProducts.length} produits</span></aside></section>
 <CategoryCatalogClient slug={slug} products={[...customProducts,...visibleBuiltIns]}/></main>
}
