const e={initializeApp({databaseURL:e}){this.databaseURL=e},database(){const{databaseURL:e}=this,t=e=>e.json(),a={credentials:"same-origin"};return{ref:n=>({child:s=>({once(o,r){fetch(`${e}/${n}/${s}.json`,a).then(t).then(e=>r({val:()=>e}))}})})}}},t=self.requestIdleCallback||setTimeout;var a,n;Promise.all([(a="../@/3rd/uhtml.js",n="uhtml",new Promise(e=>{const t=document.createElement("script");t.onload=()=>e(self[n]),t.async=!0,t.src=a,document.head.appendChild(t)})),import("./hn.js"),import("./view.js")]).then(([a,{default:n},{default:s}])=>{const o=!(matchMedia("(display-mode: standalone)").matches||navigator.standalone||document.referrer.includes("android-app://")),{stories:r,story:i,item:c,user:l,parse:d}=n(e),{render:h,html:u}=a,{body:m}=document,{header:p,main:f,footer:b,about:g,details:v,profile:k,notFound:x}=s(a),$=()=>{m.classList.remove("loading")},y=(e,t)=>{h(m,u`${e}${t}${b()}`)};let L=((e,t=(()=>{}))=>({next(...a){t(),t=e(...a)}}))(e=>{m.classList.add("loading");const{id:a,page:n,type:s,pathname:o,user:h}=d(e),u=p({page:n,header:{current:o,stories:r}});let b=!0,L=!0;switch(s){case"item":c(a).then(e=>{if(e){t($),document.title="iHN: "+e.title;const a=e=>{const s=c(e);return s.then(e=>{e&&(s.model=e,e.comments=(e.kids||[]).map(a),L&&(L=!L,t(n)))}),s},n=()=>{b&&(y(u,v(e)),L=!0)};e.comments=(e.kids||[]).map(a),n()}else y(u,x())});break;case"story":i(o).then(e=>{t($);const a=Math.ceil(e.length/20),s=20*(n-1),r=20*n;document.title=`iHN: ${o} stories (${n}/${a})`;const i=e.slice(s,r).map((e,a)=>{const n=c(e);return n.then(e=>{e&&(n.index=s+a+1,n.model=e,L&&(L=!L,t(l)))}),n}),l=()=>{b&&(y(u,f(o,i,n,a)),L=!0)};l()});break;case"user":l(h).then(e=>{b&&(e?(t($),document.title="iHN: user "+e.id,y(u,k(e))):(t($),y(u,x())))});break;default:if(/\/about\/$/.test(e)){const e=p({page:n,header:{current:"about",stories:r}});g().then(a=>{b&&(t($),document.title="iHN: About",y(e,a))})}else t($),y(u,x())}return()=>{b=!1}});const j=[location.href];self.SSR||L.next(location.href),m.addEventListener("click",e=>{const{target:t}=e,a=t.closest("a");if(a){const t=a.getAttribute("href");switch(!0){case"#back"===t:e.preventDefault(),o?history.back():1<j.length&&(j.pop(),L.next(j[j.length-1]));break;case"#share"===t:e.preventDefault();const n=o?location.href:j[j.length-1],{previousElementSibling:s}=a,r=()=>{s.textContent="⚠ error"};navigator.share?navigator.share({title:"iHN",text:document.title,url:n}).then(()=>{},r):navigator.clipboard.writeText(n).then(()=>{s.textContent="copied to clipboard"},r);break;case/^(?:\.|\/)/.test(t):e.preventDefault(),L.next(t),o?history.pushState(null,document.title,t):50<j.push(t)&&j.shift()}}}),o&&self.addEventListener("popstate",()=>{L.next(location.href)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("../sw.js",{scope:"../"})});