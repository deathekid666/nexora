"use client";
import {useEffect,useRef,useState,type ChangeEvent,type FormEvent} from "react";
import {ArrowDown,ArrowUp,ImagePlus,Trash2} from "lucide-react";
import {upload} from "@vercel/blob/client";
import {catalogs,type CatalogVariant} from "@/lib/category-catalogs";
import StoreHeader from "@/components/StoreHeader";
import styles from "@/app/admin/catalog/catalog-admin.module.css";
type Base={slug:string;name:string;price:string};
type Custom={productSlug:string;categorySlug:string;categoryTitle:string;brand:string;name:string;price:string;image:string;images?:string[];badge?:string;specs:string[];stockCount:number;variants:CatalogVariant[]};
type Entry={slug:string;priceMad:number;stock:number;enabled:boolean;variants:DraftVariant[]};
type DraftVariant={storage:string;color:string;priceMad:string;compareAtPriceMad:string;stock:string};
type Managed={slug:string;name:string;brand:string;category:string;image:string;price:string;oldPrice?:string;variants:{storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number}[];enabled:boolean};
const money=(v:string)=>Number(v.replace(/[^0-9]/g,""))||0;
const emptyVariant=():DraftVariant=>({storage:"128 Go",color:"Noir",priceMad:"",compareAtPriceMad:"",stock:"1"});
export default function CatalogAdminClient(){
 const [products,setProducts]=useState<Base[]>([]),[custom,setCustom]=useState<Custom[]>([]),[entries,setEntries]=useState<Record<string,Entry>>({}),[managed,setManaged]=useState<Managed[]>([]);
 const [notice,setNotice]=useState(""),[busy,setBusy]=useState(false),[editingSlug,setEditingSlug]=useState<string|null>(null);
 const [form,setForm]=useState({name:"",brand:"",categorySlug:"smartphones",image:"",badge:""});
 const [specs,setSpecs]=useState<string[]>([""]);
 const [variants,setVariants]=useState<DraftVariant[]>([emptyVariant()]);
 const [images,setImages]=useState<string[]>([]),[uploadingImages,setUploadingImages]=useState(false);
 const imageInputRef=useRef<HTMLInputElement>(null);
 async function load(){setBusy(true);setNotice("");try{
  const r=await fetch("/api/catalog-management",{cache:"no-store"}),d=await r.json();
  if(!r.ok)throw Error(d.error||"Impossible de charger le catalogue.");
  setProducts(d.products||[]);setCustom(d.customProducts||[]);setManaged(d.managedProducts||[]);
  const next:Record<string,Entry>={};for(const p of d.products||[]){const found=(d.overrides||[]).find((x:Entry)=>x.slug===p.slug);const managedProduct=(d.managedProducts||[]).find((x:Managed)=>x.slug===p.slug);next[p.slug]=found||{slug:p.slug,priceMad:money(p.price),stock:0,enabled:true};if(managedProduct)next[p.slug]={...next[p.slug],enabled:managedProduct.enabled,variants:managedProduct.variants.map((v:{storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number})=>({storage:v.storage,color:v.color,priceMad:String(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?String(v.compareAtPriceMad):"",stock:String(v.stock)}))};}
  setEntries(next);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 useEffect(()=>{void load()},[]);
 async function handleImageSelect(event:ChangeEvent<HTMLInputElement>){
  const selected=Array.from(event.currentTarget.files||[]);event.currentTarget.value="";
  if(!selected.length)return;
  if(images.length+selected.length>8){setNotice("Vous pouvez ajouter jusqu’à 8 images par produit.");return;}
  const allowed=new Set(["image/jpeg","image/png","image/webp","image/avif"]);
  const invalid=selected.find(file=>!allowed.has(file.type)||file.size>5*1024*1024||file.size===0);
  if(invalid){setNotice("Format non pris en charge ou fichier trop lourd : utilisez JPG, PNG, WEBP ou AVIF, jusqu’à 5 Mo par image.");return;}
  setUploadingImages(true);setNotice("");
  try{
   const uploaded:string[]=[];
   for(let i=0;i<selected.length;i++){
    const file=selected[i];
    const safeName=file.name.replace(/[^A-Za-z0-9._-]/g,"-").slice(-100)||"product-image";
    const blob=await upload("products/"+crypto.randomUUID()+"-"+safeName,file,{access:"public",handleUploadUrl:"/api/admin/upload"});
    uploaded.push(blob.url);setNotice("Téléversement des images… "+(i+1)+"/"+selected.length);
   }
   const next=[...images,...uploaded];setImages(next);setForm(current=>({...current,image:next[0]||""}));
   setNotice(uploaded.length+" image"+(uploaded.length>1?"s":"")+" ajoutée"+(uploaded.length>1?"s":"")+". Vous pouvez choisir l’image principale et réorganiser la galerie.");
  }catch(error){setNotice(error instanceof Error?error.message:"Échec du téléversement. Vérifiez votre connexion puis réessayez.");}
  finally{setUploadingImages(false);}
 }
 function moveImage(index:number,direction:-1|1){
  const target=index+direction;if(target<0||target>=images.length)return;
  const next=[...images];[next[index],next[target]]=[next[target],next[index]];
  setImages(next);setForm(current=>({...current,image:next[0]||""}));
 }
 function removeImage(index:number){
  const next=images.filter((_,i)=>i!==index);setImages(next);setForm(current=>({...current,image:next[0]||""}));
 }
 async function save(e:FormEvent){e.preventDefault();if(!images.length){setNotice("Ajoutez au moins une image avant de publier.");return;}setBusy(true);setNotice("");try{
  const payload={...form,slug:editingSlug||undefined,image:images[0],images,variants:variants.map(v=>({storage:v.storage,color:v.color,priceMad:Number(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?Number(v.compareAtPriceMad):null,stock:Number(v.stock)})),specs:specs.map(s=>s.trim()).filter(Boolean)};
  const r=await fetch("/api/catalog-management",{method:editingSlug?"PUT":"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
  const d=await r.json();if(!r.ok)throw Error(d.error||(editingSlug?"Modification impossible.":"Création impossible."));
  const successMessage=editingSlug?"Produit modifié et enregistré.":"Produit publié sur le site.";setEditingSlug(null);setForm({name:"",brand:"",categorySlug:"smartphones",image:"",badge:""});setSpecs([""]);setImages([]);setVariants([emptyVariant()]);
  await load();setNotice(successMessage);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 function editCustom(p:Custom){setEditingSlug(p.productSlug);setForm({name:p.name,brand:p.brand,categorySlug:p.categorySlug,image:p.image,badge:p.badge||"",});setImages(p.images?.length?p.images:[p.image]);setSpecs(p.specs?.length?p.specs:[""]);setVariants(p.variants.length?p.variants.map(v=>({storage:v.storage,color:v.color,priceMad:String(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?String(v.compareAtPriceMad):"",stock:String(v.stock)})):[emptyVariant()]);setNotice("Modification de « "+p.name+" ». Ajoutez une option sans recréer la fiche produit.");window.scrollTo({top:0,behavior:"smooth"})}
 function cancelEdit(){setEditingSlug(null);setForm({name:"",brand:"",categorySlug:"smartphones",image:"",badge:""});setSpecs([""]);setImages([]);setVariants([emptyVariant()]);setNotice("Modification annulée.")}
 async function remove(slug:string,name:string){if(!window.confirm("Supprimer « "+name+" » du catalogue du site ?"))return;setBusy(true);setNotice("");try{const r=await fetch("/api/catalog-management?slug="+encodeURIComponent(slug),{method:"DELETE"});const d=await r.json();if(!r.ok)throw Error(d.error||"Suppression impossible.");setNotice("Produit supprimé.");await load()}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function saveEntry(entry:Entry){setBusy(true);try{const r=await fetch("/api/catalog-management",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({...entry,variants:entry.variants.map(v=>({storage:v.storage,color:v.color,priceMad:Number(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?Number(v.compareAtPriceMad):null,stock:Number(v.stock)}))})});const d=await r.json();if(!r.ok)throw Error(d.error||"Mise à jour impossible");setNotice("Options, prix et stocks enregistrés.");await load()}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 const setVariant=(index:number,key:keyof DraftVariant,value:string)=>setVariants(current=>current.map((v,i)=>i===index?{...v,[key]:value}:v));
 return <main className={styles.page}><StoreHeader/><section className={styles.wrap}>
 <nav className={styles.nav}><a href="/admin/orders">Commandes</a><a href="/admin/analytics">Historique & analyses</a><a href="/admin/catalog" aria-current="page">Produits</a></nav>
 <div className={styles.heading}><span className={styles.kicker}>ADMIN PANEL · PRODUITS</span><h1>Gestion des produits</h1><p>Publiez des produits et gérez leurs options, leurs stocks et leurs promotions.</p></div>
 {notice&&<p className={styles.notice} role="status">{notice}</p>}
 <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.sectionTag}>{editingSlug?"MODIFICATION":"NOUVELLE FICHE"}</span><h2>{editingSlug?"Modifier le produit":"Ajouter un produit"}</h2><p>Les caractéristiques restent communes à la fiche. Ajoutez uniquement les combinaisons de stockage/couleur nécessaires.</p></div></div>
 <form onSubmit={save} className={styles.form}>
 <div className={styles.field}><label htmlFor="product-name">Nom du produit</label><input id="product-name" required minLength={2} maxLength={120} placeholder="Ex. Galaxy S26 Ultra" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
 <div className={styles.field}><label htmlFor="product-brand">Marque</label><input id="product-brand" required maxLength={80} placeholder="Samsung" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/></div>
 <div className={styles.field}><label htmlFor="product-category">Catégorie</label><select id="product-category" value={form.categorySlug} onChange={e=>setForm({...form,categorySlug:e.target.value})}>{Object.entries(catalogs).map(([slug,c])=><option key={slug} value={slug}>{c.title}</option>)}</select></div>
 <div className={styles.field+" "+styles.wide}>
  <label htmlFor="product-images">Images du produit (8 maximum)</label>
  <input ref={imageInputRef} id="product-images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={handleImageSelect}/>
  <div className={styles.imageUploadActions}><button className={styles.secondaryButton} type="button" disabled={busy||uploadingImages} onClick={()=>imageInputRef.current?.click()}><ImagePlus size={16}/>{uploadingImages?"Téléversement…":"Joindre des images depuis le PC"}</button><span>JPG, PNG, WEBP ou AVIF · 5 Mo maximum par image</span></div>
  {images.length>0&&<div className={styles.imageGrid}>{images.map((url,index)=><article className={styles.imageItem} key={url}><img src={url} alt={"Aperçu image produit "+(index+1)}/><div className={styles.imageItemActions}><button type="button" className={index===0?styles.mainImageButton:styles.setMainButton} disabled={busy||uploadingImages||index===0} onClick={()=>{const next=[url,...images.filter((item)=>item!==url)];setImages(next);setForm(current=>({...current,image:next[0]||""}));}}>{index===0?"Image principale":"Définir principale"}</button><button type="button" className={styles.imageIconButton} aria-label="Déplacer vers le haut" title="Déplacer vers le haut" disabled={busy||uploadingImages||index===0} onClick={()=>moveImage(index,-1)}><ArrowUp size={15}/></button><button type="button" className={styles.imageIconButton} aria-label="Déplacer vers le bas" title="Déplacer vers le bas" disabled={busy||uploadingImages||index===images.length-1} onClick={()=>moveImage(index,1)}><ArrowDown size={15}/></button><button type="button" className={styles.imageIconButton+" "+styles.deleteImageButton} aria-label="Supprimer l’image" title="Supprimer l’image" disabled={busy||uploadingImages} onClick={()=>removeImage(index)}><Trash2 size={15}/></button></div></article>)}</div>}
  {images.length===0&&<p className={styles.imageEmpty}>Aucune image jointe. Ajoutez au moins une image pour publier le produit.</p>}
 </div>
 <div className={styles.field}><label htmlFor="product-badge">Badge (facultatif)</label><input id="product-badge" maxLength={40} placeholder="Nouveau, Promo…" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></div>
 <div className={styles.field+" "+styles.wide}><label>Caractéristiques communes</label><p>Ajoutez chaque caractéristique dans son propre champ. Elles seront partagées par toutes les options de stockage/couleur.</p><div className={styles.variantList}>{specs.map((spec,index)=><div className={styles.variantRow} key={index}><div className={styles.field}><label htmlFor={"product-spec-"+index}>Caractéristique {index+1}</label><input id={"product-spec-"+index} maxLength={100} placeholder={index===0?"Écran AMOLED":"Ex. Batterie 5000 mAh"} value={spec} onChange={e=>setSpecs(current=>current.map((value,i)=>i===index?e.target.value:value))}/></div><button className={styles.removeOption} type="button" aria-label={"Supprimer la caractéristique "+(index+1)} disabled={specs.length===1} onClick={()=>setSpecs(current=>current.filter((_,i)=>i!==index))}>×</button></div>)}</div><button className={styles.secondaryButton} type="button" disabled={specs.length>=8} onClick={()=>setSpecs(current=>[...current,""])}>+ Ajouter une caractéristique</button></div>
 <div className={styles.variantsHead}><div><h3>Options et prix</h3><p>Chaque combinaison peut avoir son propre prix et son stock.</p></div><button className={styles.secondaryButton} type="button" onClick={()=>setVariants(v=>[...v,emptyVariant()])}>+ Ajouter une option</button></div>
 <div className={styles.variantList}>{variants.map((v,i)=><div className={styles.variantRow} key={i}>
 <div className={styles.field}><label>Stockage / taille</label><input required maxLength={50} placeholder="256 Go" value={v.storage} onChange={e=>setVariant(i,"storage",e.target.value)}/></div>
 <div className={styles.field}><label>Couleur</label><input required maxLength={50} placeholder="Noir" value={v.color} onChange={e=>setVariant(i,"color",e.target.value)}/></div>
 <div className={styles.field}><label>Prix de vente (DH)</label><input required type="number" min="1" step="1" placeholder="8999" value={v.priceMad} onChange={e=>setVariant(i,"priceMad",e.target.value)}/></div>
 <div className={styles.field}><label>Prix avant promo (DH)</label><input type="number" min="1" step="1" placeholder="Facultatif" value={v.compareAtPriceMad} onChange={e=>setVariant(i,"compareAtPriceMad",e.target.value)}/></div>
 <div className={styles.field}><label>Stock</label><input required type="number" min="0" step="1" value={v.stock} onChange={e=>setVariant(i,"stock",e.target.value)}/></div>
 <button className={styles.removeOption} type="button" aria-label="Supprimer cette option" disabled={variants.length===1} onClick={()=>setVariants(v=>v.filter((_,n)=>n!==i))}>×</button>
 </div>)}</div>
 <div className={styles.formActions}><button className={styles.primaryButton} disabled={busy||uploadingImages} type="submit">{busy?(editingSlug?"Enregistrement…":"Publication…"):(editingSlug?"Enregistrer les modifications":"Publier le produit")}</button>{editingSlug&&<button className={styles.secondaryButton} type="button" disabled={busy||uploadingImages} onClick={cancelEdit}>Annuler</button>}<span>Les prix de promotion sont affichés sur la fiche produit.</span></div>
 </form></section>
 <section className={styles.listSection}><div className={styles.listHeading}><div><span className={styles.sectionTag}>VOTRE CATALOGUE</span><h2>Produits publiés <small>{custom.length}</small></h2></div><button className={styles.secondaryButton} type="button" disabled={busy} onClick={()=>void load()}>Actualiser</button></div>
 {custom.length===0?<div className={styles.empty}><strong>Aucun produit ajouté pour le moment</strong><span>Les produits que vous publiez apparaîtront ici et sur le site.</span></div>:<div className={styles.productList}>{custom.map(p=><article key={p.productSlug} className={styles.productCard}>
 <img src={p.image} alt="" width="72" height="72"/><div className={styles.productInfo}><strong>{p.brand} {p.name}</strong><span>{p.categoryTitle} · Dès {p.price} · Stock {p.stockCount}</span><small>{p.variants.length} option{p.variants.length===1?"":"s"} · {p.variants.filter(v=>v.compareAtPriceMad).length} en promotion</small><a href={"/products/"+p.productSlug}>Voir sur le site</a></div><button className={styles.secondaryButton} type="button" disabled={busy} onClick={()=>editCustom(p)}>Modifier</button><button className={styles.deleteButton} type="button" disabled={busy} onClick={()=>void remove(p.productSlug,p.name)}>Supprimer</button></article>)}</div>}
 </section>
 <section className={styles.listSection}><div className={styles.listHeading}><div><span className={styles.sectionTag}>RÉFÉRENCES DU SITE</span><h2>Produits déjà intégrés <small>{products.length}</small></h2><p>Modifiez les combinaisons, ajoutez des couleurs ou stockages, puis définissez prix, promotions et stock pour chaque option.</p></div></div>
 <div className={styles.builtInList}>{managed.map(p=>{const entry=entries[p.slug];if(!entry)return null;return <article key={p.slug} className={styles.builtInEditor}>
  <div className={styles.builtInTop}><div><strong>{p.brand} {p.name}</strong><span>{p.category} · {p.variants.length} options</span></div><label className={styles.toggle}>Visible sur le site<input type="checkbox" checked={entry.enabled} onChange={e=>setEntries({...entries,[p.slug]:{...entry,enabled:e.target.checked}})}/></label></div>
  <div className={styles.existingVariants}>{entry.variants.map((v,i)=><div key={i} className={styles.existingVariantRow}>
   <label>Stockage / version<input value={v.storage} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,storage:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Couleur<input value={v.color} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,color:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Prix DH<input type="number" min="1" value={v.priceMad} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,priceMad:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Prix avant promo<input type="number" min="1" placeholder="Facultatif" value={v.compareAtPriceMad} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,compareAtPriceMad:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Stock<input type="number" min="0" value={v.stock} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,stock:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <button type="button" className={styles.removeOption} aria-label="Retirer cette option" disabled={entry.variants.length<=1} onClick={()=>setEntries({...entries,[p.slug]:{...entry,variants:entry.variants.filter((_,j)=>j!==i)}})}>×</button>
  </div>)}</div>
  <div className={styles.builtInActions}><button type="button" className={styles.secondaryButton} onClick={()=>setEntries({...entries,[p.slug]:{...entry,variants:[...entry.variants,{storage:"Nouvelle capacité "+(entry.variants.length+1),color:"Nouvelle couleur "+(entry.variants.length+1),priceMad:String(entry.priceMad),compareAtPriceMad:"",stock:"0"}]}})}>+ Ajouter stockage / couleur</button><button type="button" className={styles.primaryButton} disabled={busy} onClick={()=>void saveEntry(entry)}>Enregistrer les modifications</button></div>
 </article>})}</div>
 </section></section></main>;
}
