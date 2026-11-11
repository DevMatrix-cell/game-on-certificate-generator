export function makeCertificateId(){ return "GEM-"+new Date().getFullYear()+"-"+crypto.randomUUID().slice(0,8).toUpperCase(); }
