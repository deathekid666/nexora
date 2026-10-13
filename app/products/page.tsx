import {ArrowLeft,PackageCheck,ShieldCheck,Truck} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import AllProductsClient from "@/components/AllProductsClient";
import {allCatalogProducts} from "@/lib/category-catalogs";
import {listCustomProducts,listDisabledBuiltInSlugs} from "@/lib/catalog-admin";
export const dynamic="force-dynamic";
export default async function ProductsPage(){
 const disabled=await listDisabledBuiltInSlugs();
 const builtIns=allCatalogProducts.filter(product=>!disabled.includes(product.detailSlug||product.productSlug));
 const products=[...await listCustomProducts(),...builtIns];
 return <main className="exact-page all-products-page"><SiteMotion/><StoreHeader/>
 <section className="all-products-hero"><div className="exact-shell all-products-hero-inner"><div><a href="/"><ArrowLeft size={15}/> Accueil</a><span>CATALOGUE LHAWTA</span><h1>Tous les produits</h1><p>Explorez tout le catalogue LHAWTA : smartphones, tablettes, gaming, audio, TV, wearables, informatique et accessoires.</p></div>
 <aside><strong>{products.length}</strong><span>produits actuellement référencés</span><div><p><PackageCheck size={15}/> Produits neufs</p><p><Truck size={15}/> Livraison au Maroc</p><p><ShieldCheck size={15}/> Garantie affichée sur les fiches détaillées</p></div></aside></div></section>
 <AllProductsClient products={products}/></main>
}
