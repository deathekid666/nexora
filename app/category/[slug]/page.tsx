import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import CategoryCatalogClient from "@/components/CategoryCatalogClient";
import { catalogs } from "@/lib/category-catalogs";

export function generateStaticParams(){
  return Object.keys(catalogs).map(slug=>({slug}));
}

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const category=catalogs[slug];
  if(!category) notFound();

  return (
    <main className="lhawta-sketch-site category-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="category-hero">
        <div>
          <a href="/" className="category-back"><ArrowLeft size={15}/> Accueil</a>
          <span>{category.eyebrow}</span>
          <h1>{category.title}</h1>
          <p>{category.copy}</p>
        </div>
        <aside>
          <small>CATÉGORIE</small>
          <strong>{category.accent}</strong>
          <span>{category.products.length} produits en vedette</span>
        </aside>
      </section>

      <CategoryCatalogClient slug={slug} products={category.products}/>
    </main>
  );
}
