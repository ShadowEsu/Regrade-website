import{_ as m,p as _,a as g}from"./pdf.worker.min-BznYFuNS.js";let c=!1;function w(){c||(g.workerSrc=_,c=!0)}async function d(f){w();const p=new Uint8Array(await f.arrayBuffer()),s=await m({data:p}).promise,i=[];for(let e=1;e<=s.numPages;e++){const l=await(await s.getPage(e)).getTextContent(),n=[];let r=null;for(const o of l.items){if(!("str"in o))continue;const u=o.str,a=o.transform,t=a==null?void 0:a[5];t!=null&&r!=null&&Math.abs(t-r)>4&&n.push(`
`),n.push(u),t!=null&&(r=t)}i.push(n.join(" ").replace(/ +\n +/g,`
`).trim())}return i.join(`

`).trim()}export{d as extractTextFromPdfFile};
