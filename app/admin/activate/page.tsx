"use client";
import {FormEvent,useState} from "react";
import {ShieldCheck,KeyRound,ArrowRight} from "lucide-react";
export default function AdminActivate(){
 const [key,setKey]=useState("");const[error,setError]=useState("");const[busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{
 const r=await fetch("/api/admin/claim",{method:"POST",headers:{authorization:"Bearer "+key}});
 const j=await r.json();if(!r.ok)throw Error(j.error==="LOGIN_REQUIRED"?"Connectez-vous d’abord avec votre compte client.":j.error==="NOT_ELIGIBLE"?"Ce compte n’est pas autorisé pour l’administration.":j.error==="INVALID_ADMIN_KEY"?"Clé administrateur incorrecte.":"Activation indisponible.");
 window.location.assign("/admin/orders");
 }catch(e){setError(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 return <main style={{minHeight:"85vh",display:"grid",placeItems:"center",background:"#f2f7f5",padding:20}}><section style={{maxWidth:450,width:"100%",background:"white",padding:36,borderRadius:22,boxShadow:"0 16px 60px #183b2920"}}>
 <ShieldCheck size={34} color="#168254"/><p style={{fontSize:12,letterSpacing:2,color:"#168254",fontWeight:800}}>LHAWTA ADMIN</p><h1 style={{fontSize:27,color:"#172b36"}}>Activer mon accès administrateur</h1><p style={{color:"#687b85",lineHeight:1.6}}>Connectez-vous avec votre compte LHAWTA, puis confirmez votre accès à l’aide de la clé administrateur existante. Cette opération est nécessaire une seule fois.</p>
 <form onSubmit={submit} style={{display:"grid",gap:16}}><label style={{display:"grid",gap:8,fontWeight:650}}>Clé administrateur<div style={{display:"flex",gap:8,alignItems:"center",border:"1px solid #dce5e5",borderRadius:10,padding:"0 12px"}}><KeyRound size={18} color="#84969d"/><input required type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)} placeholder="Clé existante" style={{border:0,outline:0,height:48,width:"100%",fontSize:16}}/></div></label>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}<button disabled={busy} style={{background:"#168254",color:"white",border:0,borderRadius:10,padding:15,fontWeight:750,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9}}>{busy?"Activation…":"Activer mon accès"}<ArrowRight size={18}/></button></form>
 <p style={{marginTop:20,fontSize:13}}><a href="/login" style={{color:"#168254"}}>Se connecter à mon compte</a></p></section></main>
}
