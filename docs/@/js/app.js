const e={initializeApp({databaseURL:e}){this.databaseURL=e},database(){const{databaseURL:e}=this,t=e=>e.json(),a={credentials:"same-origin"};return{ref:n=>({child:s=>({once(r,o){fetch(`${e}/${n}/${s}.json`,a).then(t).then(e=>o({val:()=>e}))}})})}}},t=self.requestIdleCallback||setTimeout;var a,n;Promise.all([(a="../@/3rd/uhtml.js",n="uhtml",new Promise(e=>{const t=document.createElement("script");t.onload=()=>e(self[n]),t.async=!0,t.src=a,document.head.appendChild(t)})),import("./hn.js"),import("./view.js")]).then(([a,{default:n},{default:s}])=>{const r=!(matchMedia("(display-mode: standalone)").matches||navigator.standalone||document.referrer.includes("android-app://")),{stories:o,story:i,item:c,user:l,parse:d,cache:h}=n(e),{render:u,html:m}=a,{body:p}=document,{header:f,main:g,footer:b,about:v,details:k,profile:$,notFound:x}=s(a),y=()=>{p.classList.remove("loading")},L=(e,t)=>{u(p,m`${e}${t}${b()}`)};let w=((e,t=(()=>{}))=>({next(a){t(),t=e(a)}}))(e=>{p.classList.add("loading");const{id:a,page:n,type:s,pathname:r,user:h}=d(e),u=f({page:n,header:{current:r,stories:o}});let m=!0,b=!0;switch(s){case"item":c(a).then(e=>{if(e){t(y),document.title="iHN: "+e.title;const a=e=>{const s=c(e);return s.then(e=>{e&&(s.model=e,e.comments=(e.kids||[]).map(a),b&&(b=!b,t(n)))}),s},n=()=>{m&&(L(u,k(e)),b=!0)};e.comments=(e.kids||[]).map(a),n()}else L(u,x())});break;case"story":i(r).then(e=>{t(y);const a=Math.ceil(e.length/20),s=20*(n-1),o=20*n;document.title=`iHN: ${r} (${n}/${a})`;const i=e.slice(s,o).map((e,a)=>{const n=c(e);return n.then(e=>{e&&(n.index=s+a+1,n.model=e,b&&(b=!b,t(l)))}),n}),l=()=>{m&&(L(u,g(r,i,n,a)),b=!0)};l()});break;case"user":l(h).then(e=>{m&&(e?(t(y),document.title="iHN: user "+e.id,L(u,$(e))):(t(y),L(u,x())))});break;default:if(/\/about\/$/.test(e)){const e=f({page:n,header:{current:"about",stories:o}});v().then(a=>{m&&(t(y),document.title="iHN: about",L(e,a))})}else t(y),L(u,x())}return()=>{m=!1}});const j=[location.href];self.SSR||w.next(location.href),p.addEventListener("click",e=>{const{target:t}=e,a=t.closest("a");if(a){const t=a.getAttribute("href");switch(!0){case"#back"===t:e.preventDefault(),r?history.back():1<j.length&&(j.pop(),w.next(j[j.length-1]));break;case"#share"===t:e.preventDefault();const n=r?location.href:j[j.length-1],{title:s}=document;if(navigator.share)navigator.share({text:s,title:s,url:n});else{const{previousElementSibling:e}=a,t=()=>{e.textContent="⚠ error"};navigator.permissions.query({name:"clipboard-write"}).then(({state:a})=>{/^(?:granted|prompt)$/.test(a)?navigator.clipboard.writeText(n).then(()=>{e.textContent="✔ copied"},t):t()})}break;case/^(?:\.|\/)/.test(t):e.preventDefault(),w.next(t),r?history.pushState(null,document.title,t):50<j.push(t)&&j.shift()}}}),r&&addEventListener("popstate",()=>{w.next(location.href)}),addEventListener("online",()=>h.clear()),"serviceWorker"in navigator&&navigator.serviceWorker.register("../sw.js",{scope:"../"})});