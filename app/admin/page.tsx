import Link from "next/link";
import {redirect} from "next/navigation";
import {ClipboardList,History,PackagePlus} from "lucide-react";
import {currentAdminCustomer} from "@/lib/customer-auth";
import StoreHeader from "@/components/StoreHeader";
import styles from "./admin-panel.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"Admin Panel | LHAWTA",robots:{index:false,follow:false}};
const sections=[
 {href:"/admin/orders",title:"Progression des commandes",copy:"Suivez chaque commande, puis marquez-la confirmée, expédiée ou livrée.",icon:ClipboardList,action:"Ouvrir les commandes"},
 {href:"/admin/analytics",title:"Historique & analyses",copy:"Consultez les commandes passées, filtrez par date et suivez les résultats.",icon:History,action:"Voir l’historique"},
 {href:"/admin/catalog",title:"Posts / produits",copy:"Publiez de nouveaux produits sur le site ou supprimez ceux que vous avez ajoutés.",icon:PackagePlus,action:"Gérer les produits"},
];
export default async function AdminPanel(){if(!await currentAdminCustomer())redirect("/login");return <main className={"exact-page "+styles.page}><StoreHeader/><section className={styles.wrap}><span className={styles.kicker}>ESPACE ADMINISTRATEUR</span><h1>Admin Panel</h1><p className={styles.intro}>Choisissez ce que vous souhaitez gérer.</p><div className={styles.grid}>{sections.map(({href,title,copy,icon:Icon,action})=><Link className={styles.card} href={href} key={href}><span className={styles.icon}><Icon size={23}/></span><h2>{title}</h2><p>{copy}</p><b>{action}<span aria-hidden="true"> →</span></b></Link>)}</div></section></main>}
