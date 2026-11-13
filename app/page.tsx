 "use client";
import {useRef,useState} from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import {toPng} from "html-to-image";
import {supabase} from "@/lib/supabase";
import {makeCertificateId} from "@/lib/certificate";

export default function Home(){
 const [name,setName]=useState(""); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [issued,setIssued]=useState<{id:string;name:string}|null>(null);
 const nameRef=useRef<HTMLDivElement>(null);
 async function generate(){
  const clean=name.trim().replace(/\s+/g," ");
  if(clean.length<2){setMessage("Please enter your full name.");return}
  if(clean.length>70){setMessage("Please keep your name under 70 characters.");return}
  setBusy(true);setMessage("");
  try{
   const id=makeCertificateId(); const site=process.env.NEXT_PUBLIC_SITE_URL||window.location.origin;
   const verifyUrl=`${site}/verify/${id}`;
   let qrData=""; try{qrData=await QRCode.toDataURL(verifyUrl,{width:180,margin:1});}catch{}
   if(supabase){
    const {error}=await supabase.from("certificates").insert({certificate_id:id,participant_name:clean,event_name:"Game On: Imagine The Impossible"});
    if(error) throw error;
   }
   const pdf=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
   pdf.setFillColor(250,252,255);pdf.rect(0,0,297,210,"F");
   pdf.setDrawColor(66,133,244);pdf.setLineWidth(2);pdf.rect(8,8,281,194);
   pdf.setDrawColor(251,188,5);pdf.setLineWidth(.6);pdf.rect(12,12,273,186);
   pdf.setTextColor(66,133,244);pdf.setFont("helvetica","bold");pdf.setFontSize(12);pdf.text("#Team Gemini  |  Google Student Ambassador Community Session",148.5,32,{align:"center"});
   pdf.setTextColor(20,38,75);pdf.setFont("times","bold");pdf.setFontSize(31);pdf.text("Certificate of Participation",148.5,66,{align:"center"});
   pdf.setTextColor(75,85,99);pdf.setFont("helvetica","normal");pdf.setFontSize(14);pdf.text("This certificate is presented to",148.5,88,{align:"center"});
   await document.fonts.load('700 38px "Dancing Script"');
   const nameElement=nameRef.current;
   if(!nameElement) throw new Error("The certificate name could not be rendered.");
   const nameImage=await toPng(nameElement,{pixelRatio:3,style:{borderBottom:"none",paddingBottom:"0"}});
   const nameBounds=nameElement.getBoundingClientRect();
   const nameWidth=Math.min(235,nameBounds.width*25.4/96);
   const nameHeight=nameWidth*nameBounds.height/nameBounds.width;
   pdf.addImage(nameImage,"PNG",148.5-nameWidth/2,108-nameHeight,nameWidth,nameHeight);
   pdf.setDrawColor(251,188,5);pdf.line(55,114,242,114);
   pdf.setTextColor(75,85,99);pdf.setFont("helvetica","normal");pdf.setFontSize(12);
   pdf.text("for participating in",148.5,130,{align:"center"});
   pdf.setFont("helvetica","bold");pdf.setTextColor(30,64,120);pdf.setFontSize(17);pdf.text("GAME ON: IMAGINE THE IMPOSSIBLE",148.5,143,{align:"center"});
   pdf.setFont("helvetica","normal");pdf.setTextColor(75,85,99);pdf.setFontSize(11);pdf.text("A community session exploring game creation with Gemini and Nano Banana",148.5,153,{align:"center"});
   pdf.setFontSize(9);pdf.text("14 November 2026  •  NTR Block, Room 12",148.5,169,{align:"center"});
   pdf.setFont("helvetica","bold");pdf.setTextColor(66,133,244);pdf.text("Google Student Ambassador Community Session",148.5,183,{align:"center"});
   if(qrData)pdf.addImage(qrData,"PNG",258,165,20,20);
   pdf.setFont("helvetica","normal");pdf.setTextColor(100,116,139);pdf.setFontSize(7);pdf.text(`Certificate ID: ${id}`,20,190);
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
   <div className="row" style={{marginTop:16}}><button className="btn" onClick={generate} disabled={busy}>{busy?"Generating…":"Generate & download PDF"}</button><span className="muted">A4 landscape · PDF</span></div>
   {message&&<div className="status" role="status">{message}</div>}
   {issued&&<div className="status">Certificate ID: <b>{issued.id}</b> · <a className="link" href={`/verify/${issued.id}`}>Verification page</a></div>}
   <div className="preview"><div className="muted" style={{marginBottom:10,fontWeight:700}}>CERTIFICATE PREVIEW</div><div className="cert"><div className="mini">#TEAM GEMINI · GOOGLE STUDENT AMBASSADOR</div><h2>Certificate of Participation</h2><p>This certificate is presented to</p><div className="person" ref={nameRef}>{name.trim()||"Your Name Here"}</div><p>for participating in</p><div style={{fontWeight:800,color:"#1e4078",fontSize:"clamp(12px,2vw,20px)",marginTop:4}}>GAME ON: IMAGINE THE IMPOSSIBLE</div><p>A community session exploring game creation with Gemini and Nano Banana</p><div className="seal">GOOGLE STUDENT AMBASSADOR COMMUNITY SESSION</div><div className="footer"><span>14 November 2026 · NTR Block, Room 12</span><span>Certificate of Participation</span></div></div></div>
  </section>
  <div className="footerNote">Certificate records are verifiable by certificate ID. This self-service generator does not verify attendance.</div>
 </main>
}
