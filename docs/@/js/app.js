const e={initializeApp({databaseURL:e}){this.databaseURL=e},database(){const{databaseURL:e}=this,t=e=>e.json(),a={credentials:"same-origin"};return{ref:n=>({child:s=>({once(r,o){fetch(`${e}/${n}/${s}.json`,a).then(t).then(e=>o({val:()=>e}))}})})}}},t=self.requestIdleCallback||setTimeout;var a,n;Promise.all([(a="../@/3rd/uhtml.js",n="uhtml",new Promise(e=>{const t=document.createElement("script");t.onload=()=>e(self[n]),t.async=!0,t.src=a,document.head.appendChild(t)})),import("./hn.js"),import("./view.js")]).then(([a,{default:n},{default:s}])=>{const r=!(matchMedia("(display-mode: standalone)").matches||navigator.standalone||document.referrer.includes("android-app://")),{stories:o,story:i,item:c,user:l,parse:d}=n(e),{render:h,html:u}=a,{body:m}=document,{header:p,main:f,footer:b,about:g,details:v,profile:k,notFound:$}=s(a),x=()=>{m.classList.remove("loading")},y=(e,t)=>{h(m,u`${e}${t}${b()}`)};let w=((e,t=(()=>{}))=>({next(...a){t(),t=e(...a)}}))(e=>{m.classList.add("loading");const{id:a,page:n,type:s,pathname:r,user:h}=d(e),u=p({page:n,header:{current:r,stories:o}});let b=!0,w=!0;switch(s){case"item":c(a).then(e=>{if(e){t(x),document.title="iHN: "+e.title;const a=e=>{const s=c(e);return s.then(e=>{e&&(s.model=e,e.comments=(e.kids||[]).map(a),w&&(w=!w,t(n)))}),s},n=()=>{b&&(y(u,v(e)),w=!0)};e.comments=(e.kids||[]).map(a),n()}else y(u,$())});break;case"story":i(r).then(e=>{t(x);const a=Math.ceil(e.length/20),s=20*(n-1),o=20*n;document.title=`iHN: ${r} stories (${n}/${a})`;const i=e.slice(s,o).map((e,a)=>{const n=c(e);return n.then(e=>{e&&(n.index=s+a+1,n.model=e,w&&(w=!w,t(l)))}),n}),l=()=>{b&&(y(u,f(r,i,n,a)),w=!0)};l()});break;case"user":l(h).then(e=>{b&&(e?(t(x),document.title="iHN: user "+e.id,y(u,k(e))):(t(x),y(u,$())))});break;default:if(/\/about\/$/.test(e)){const e=p({page:n,header:{current:"about",stories:o}});g().then(a=>{b&&(t(x),document.title="iHN: About",y(e,a))})}else t(x),y(u,$())}return()=>{b=!1}});const L=[location.href];self.SSR||w.next(location.href),m.addEventListener("click",e=>{const{target:t}=e,a=t.closest("a");if(a){const t=a.getAttribute("href");switch(!0){case"#back"===t:e.preventDefault(),r?history.back():1<L.length&&(L.pop(),w.next(L[L.length-1]));break;case"#share"===t:e.preventDefault();const{previousElementSibling:n}=a,s=r?location.href:L[L.length-1],o=()=>{n.textContent="⚠ error"};navigator.share?navigator.share({title:"iHN",text:document.title,url:s}).then(()=>{},o):navigator.permissions.query({name:"clipboard-write"}).then(({state:e})=>{/^(?:granted|prompt)$/.test(e)?navigator.clipboard.writeText(s).then(()=>{n.textContent="copied to clipboard"},o):o()});break;case/^(?:\.|\/)/.test(t):e.preventDefault(),w.next(t),r?history.pushState(null,document.title,t):50<L.push(t)&&L.shift()}}}),r&&self.addEventListener("popstate",()=>{w.next(location.href)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("../sw.js",{scope:"../"})});