import {supabase} from "@/lib/supabase";
export default async function Verify({params}:{params:Promise<{id:string}>}){
 const {id}=await params; let record:any=null;
 if(supabase){const {data}=await supabase.from("certificates").select("certificate_id,participant_name,event_name,created_at").eq("certificate_id",id).maybeSingle();record=data;}
 return <main className="shell"><header className="top"><div className="brand">CERTIFY<span>.</span></div><div className="tag">Certificate verification</div></header><section className="panel" style={{maxWidth:650,textAlign:"center"}}>{record?<><div style={{fontSize:42}}>✓</div><h1 style={{color:"#15803d"}}>Certificate record found</h1><p className="muted">This certificate ID exists in the Certify database.</p><h2>{record.participant_name}</h2><p>{record.event_name}</p><p className="muted">Certificate ID: {record.certificate_id}</p></>:<><div style={{fontSize:42}}>ⓘ</div><h1>Verification unavailable</h1><p className="muted">{supabase?"No matching certificate record was found.":"The certificate database has not been configured yet."}</p><p className="muted">Certificate ID: {id}</p></>}</section></main>
}
