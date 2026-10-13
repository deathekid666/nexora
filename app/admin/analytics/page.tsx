import {redirect} from "next/navigation";
import {currentAdminCustomer,customerDb} from "@/lib/customer-auth";
import {ensureOrderSchema} from "@/lib/order-db";
import StoreHeader from "@/components/StoreHeader";
import styles from "./analytics.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"Historique & analyses | LHAWTA",robots:{index:false,follow:false}};
const money=(value:unknown)=>new Intl.NumberFormat("fr-MA",{style:"currency",currency:"MAD"}).format(Number(value)||0);
const labels:Record<string,string>={NOUVEAU:"Nouveau",CONFIRME:"Confirmé",EXPEDIE:"Expédié",LIVRE:"Livré",ANNULE:"Annulé"};
function date(value:unknown){return new Intl.DateTimeFormat("fr-MA",{dateStyle:"medium",timeZone:"Africa/Casablanca"}).format(new Date(String(value)))}
function validDate(value:unknown){if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const d=new Date(value);return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value?value:null}
export default async function Analytics({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 if(!await currentAdminCustomer())redirect("/login");
 const params=await searchParams;
 const from=validDate(params.from),to=validDate(params.to);
 const search=typeof params.q==="string"?params.q.trim().slice(0,120):"";
 const requestedPage=Math.max(1,Math.min(1000000,Math.floor(Number(params.page))||1));
 const reversed=Boolean(from&&to&&from>to);
 const values=[from,to,search,"%"+search+"%"];
 
const where = " WHERE ($1::date IS NULL OR created_at >= ($1::date::timestamp AT TIME ZONE 'Africa/Casablanca')) AND ($2::date IS NULL OR created_at < (($2::date + 1)::timestamp AT TIME ZONE 'Africa/Casablanca')) AND ($3='' OR order_number ILIKE $4 OR customer_name ILIKE $4)";

 let summary:Record<string,unknown>={},history:Record<string,unknown>[]=[],statuses:Record<string,unknown>[]=[],products:Record<string,unknown>[]=[];
 let failed=false,currentPage=requestedPage,pages=1;
 try{
  if(!reversed){
   await ensureOrderSchema();const sql=customerDb();
   const totals=await sql.query("SELECT count(*)::int AS count, coalesce(sum(total_mad) FILTER (WHERE status='LIVRE'),0)::float8 AS delivered, count(*) FILTER (WHERE status='LIVRE')::int AS delivered_count, coalesce(sum(total_mad) FILTER (WHERE status IN ('NOUVEAU','CONFIRME','EXPEDIE')),0)::float8 AS pending FROM lhawta_orders"+where,values);
   summary=totals[0]||{};pages=Math.max(1,Math.ceil(Number(summary.count)/25));currentPage=Math.min(requestedPage,pages);
   history=await sql.query("SELECT order_number,customer_name,city,status,total_mad,created_at FROM lhawta_orders"+where+" ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET $5",[...values,(currentPage-1)*25]);
   statuses=await sql.query("SELECT status,count(*)::int AS count FROM lhawta_orders"+where+" GROUP BY status ORDER BY count DESC",values);
   products=await sql.query("WITH selected AS (SELECT id FROM lhawta_orders"+where+" AND status='LIVRE') SELECT i.slug,max(i.product_name) AS name,sum(i.quantity)::int AS quantity,sum(i.line_total_mad)::float8 AS revenue FROM lhawta_order_items i JOIN selected s ON s.id=i.order_id GROUP BY i.slug ORDER BY quantity DESC,i.slug LIMIT 5",values);
  }
 }catch{failed=true}
 function pageUrl(n:number){const qs=new URLSearchParams();if(from)qs.set("from",from);if(to)qs.set("to",to);if(search)qs.set("q",search);qs.set("page",String(n));return "/admin/analytics?"+qs.toString()}
 return <main className="exact-page"><StoreHeader/><section className={styles.wrap}>
 <nav className={styles.nav}><a href="/admin/orders">Commandes</a><a href="/admin/analytics" aria-current="page">Historique & analyses</a></nav>
 <h1>Historique & analyses</h1><p>Vue d’ensemble des commandes enregistrées. Dates au fuseau du Maroc.</p>
 <form className={styles.filters} method="get"><label>Du<input type="date" name="from" defaultValue={from||""}/></label><label>Au<input type="date" name="to" defaultValue={to||""}/></label><label>Commande ou client<input name="q" defaultValue={search} placeholder="Rechercher…"/></label><button type="submit">Appliquer</button><a href="/admin/analytics">Réinitialiser</a></form>
 {reversed?<p role="alert">La date de début doit précéder la date de fin.</p>:failed?<p role="alert">Impossible de charger les analyses. Réessayez dans quelques instants.</p>:<>
 <div className={styles.metrics}><article><span>Commandes</span><strong>{Number(summary.count)||0}</strong></article><article><span>Valeur des commandes livrées</span><strong>{money(summary.delivered)}</strong></article><article><span>Valeur en cours</span><strong>{money(summary.pending)}</strong></article><article><span>Panier moyen livré</span><strong>{money(Number(summary.delivered_count)?Number(summary.delivered)/Number(summary.delivered_count):0)}</strong></article></div>
 <p>Les montants livrés correspondent aux commandes marquées « Livré », pas à une confirmation d’encaissement. Les commandes annulées sont exclues des montants.</p>
 <div className={styles.columns}><article className={styles.card}><h2>Répartition par statut</h2>{statuses.length?statuses.map(s=><p key={String(s.status)}>{labels[String(s.status)]||String(s.status)} <b>{Number(s.count)}</b></p>):<p>Aucune commande sur cette période.</p>}</article>
 <article className={styles.card}><h2>Produits les plus vendus</h2><p>Commandes livrées uniquement.</p>{products.length?products.map(p=><p key={String(p.slug)}>{String(p.name)} <b>{Number(p.quantity)} unités · {money(p.revenue)}</b></p>):<p>Aucune vente livrée sur cette période.</p>}</article></div>
 <article className={styles.card}><h2>Historique des commandes</h2><p>Commandes créées sur la période sélectionnée, avec leur statut actuel.</p>{history.length?<div className={styles.table}><table><thead><tr><th>Commande</th><th>Date</th><th>Client</th><th>Ville</th><th>Statut</th><th>Total</th></tr></thead><tbody>{history.map(o=><tr key={String(o.order_number)}><td>{String(o.order_number)}</td><td>{date(o.created_at)}</td><td>{String(o.customer_name)}</td><td>{String(o.city)}</td><td>{labels[String(o.status)]||String(o.status)}</td><td>{money(o.total_mad)}</td></tr>)}</tbody></table></div>:<p>Aucune commande trouvée.</p>}
 <nav className={styles.nav} aria-label="Pagination">{currentPage>1&&<a href={pageUrl(currentPage-1)}>Précédent</a>}<span>Page {currentPage} sur {pages}</span>{currentPage<pages&&<a href={pageUrl(currentPage+1)}>Suivant</a>}</nav></article></>}
 </section></main>
}
