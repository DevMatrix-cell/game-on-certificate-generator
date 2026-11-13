 "use client";
import {useRef,useState} from "react";
import jsPDF from "jspdf";
import {toPng} from "html-to-image";
import {supabase} from "@/lib/supabase";
import {makeCertificateId} from "@/lib/certificate";

export default function Home(){
 const [name,setName]=useState(""); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [issued,setIssued]=useState<{id:string;name:string}|null>(null);
 const certificateRef=useRef<HTMLDivElement>(null);
 const displayName=name.trim().replace(/\s+/g," ")||"Your Name Here";
 const nameFontSize=2.4*Math.min(1,45/displayName.length);
 async function generate(){
  const clean=name.trim().replace(/\s+/g," ");
  if(clean.length<2){setMessage("Please enter your full name.");return}
  if(clean.length>70){setMessage("Please keep your name under 70 characters.");return}
  setBusy(true);setMessage("");
  try{
   const id=makeCertificateId();
   if(supabase){
    const {error}=await supabase.from("certificates").insert({certificate_id:id,participant_name:clean,event_name:"Game On: Imagine The Impossible"});
    if(error) throw error;
   }
   await document.fonts.load('500 48px "Google Sans"');
   const certificateElement=certificateRef.current;
   if(!certificateElement) throw new Error("The certificate preview could not be rendered.");
   const templateImage=certificateElement.querySelector("img");
   if(!templateImage) throw new Error("The certificate artwork could not be loaded.");
   await templateImage.decode();
   const certificateImage=await toPng(certificateElement,{pixelRatio:3});
   const pdfWidth=297;
   const pdfHeight=pdfWidth*1442/2000;
   const pdf=new jsPDF({orientation:"landscape",unit:"mm",format:[pdfWidth,pdfHeight]});
   pdf.addImage(certificateImage,"PNG",0,0,pdfWidth,pdfHeight);
   pdf.save(`${clean.replace(/[^a-z0-9]+/gi,"-")}-Game-On-Certificate.pdf`);
   setIssued({id,name:clean});setMessage("Your certificate PDF has been downloaded.");
  }catch(e){setMessage(e instanceof Error?e.message:"Something went wrong. Please try again.");}
  finally{setBusy(false)}
 }
 return <main className="shell">
  <header className="top"><div className="brand">CERTIFY<span>.</span></div><div className="tag">#TeamGemini · 2026</div></header>
  <section className="hero"><div className="eyebrow">GOOGLE STUDENT AMBASSADOR COMMUNITY SESSION</div><h1>Your ideas.<br/><span>Your certificate.</span></h1><p>Celebrate your participation in <b>Game On: Imagine The Impossible</b>.<br/>Enter your name below to generate your personalised certificate.</p></section>
  <section className="panel">
   <label className="label" htmlFor="name">Full name (as it should appear)</label>
   <input id="name" className="input" placeholder="e.g. Manojkumar Dasari" value={name} maxLength={70} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")generate()}}/>
   <div className="row" style={{marginTop:16}}><button className="btn" onClick={generate} disabled={busy}>{busy?"Generating…":"Generate & download PDF"}</button><span className="muted">Landscape certificate · PDF</span></div>
   {message&&<div className="status" role="status">{message}</div>}
   {issued&&<div className="status">Certificate ID: <b>{issued.id}</b> · <a className="link" href={`/verify/${issued.id}`}>Verification page</a></div>}
   <div className="preview"><div className="muted" style={{marginBottom:10,fontWeight:700}}>CERTIFICATE PREVIEW</div><div className="certificate-art" ref={certificateRef}><img className="certificate-art__background" src="/certificate-template.png" alt="" /><div className="certificate-art__name" style={{fontSize:`clamp(14px, ${nameFontSize}cqw, 48px)`}}>{displayName}</div></div></div>
  </section>
  <div className="footerNote">Certificate records are verifiable by certificate ID. This self-service generator does not verify attendance.</div>
 </main>
}
