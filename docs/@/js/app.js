const e={initializeApp({databaseURL:e}){this.databaseURL=e},database(){const{databaseURL:e}=this,t=e=>e.json(),s={credentials:"same-origin"};return{ref:a=>({child:n=>({once(o,r){fetch(`${e}/${a}/${n}.json`,s).then(t).then(e=>r({val:()=>e}))}})})}}},t=self.requestIdleCallback||setTimeout;var s,a;Promise.all([(s="../@/3rd/uhtml.js",a="uhtml",new Promise(e=>{const t=document.createElement("script");t.onload=()=>e(self[a]),t.async=!0,t.src=s,document.head.appendChild(t)})),import("./hn.js"),import("./view.js")]).then(([s,{default:a},{default:n}])=>{const{stories:o,story:r,item:i,user:c,parse:l}=a(e),{render:d,html:h}=s,{body:m}=document,{header:u,main:p,footer:f,about:b,details:g,profile:v,notFound:k}=n(s),L=()=>{m.classList.remove("loading")},y=(e,t)=>{d(m,h`${e}${t}${f()}`)},$=e=>{j=e,m.classList.add("loading");const{id:s,page:a,type:n,pathname:d,user:h}=l(e),f=u({page:a,header:{current:d,stories:o}});let $=!0;switch(n){case"item":const n=j;i(s).then(e=>{if(e){t(L);const s=e=>{const n=i(e);return n.then(e=>{e&&(n.model=e,e.comments=(e.kids||[]).map(s),$&&($=!$,t(a)))}),n},a=()=>{n===j&&(y(f,g(e)),$=!0)};e.comments=(e.kids||[]).map(s),a()}else y(f,k())});break;case"story":const l=j;r(d).then(e=>{t(L);const s=Math.ceil(e.length/20),n=20*(a-1),o=20*a,r=e.slice(n,o).map((e,s)=>{const a=i(e);return a.then(e=>{e&&(a.index=n+s+1,a.model=e,$&&($=!$,t(c)))}),a}),c=()=>{l===j&&(y(f,p(r,a,s)),$=!0)};c()});break;case"user":const m=j;c(h).then(e=>{m===j&&(e?(t(L),y(f,v(e))):(t(L),y(f,k())))});break;default:if(/\/about\/$/.test(e)){const e=j,s=u({page:a,header:{current:"about",stories:o}});b().then(a=>{e===j&&(t(L),y(s,a))})}else t(L),y(f,k())}};let j="";self.SSR||$(location.href),m.addEventListener("click",e=>{const{target:t}=e,s=t.closest("a");if(s){const{href:t}=s,{hostname:a}=new URL(t);a===location.hostname&&(e.preventDefault(),$(t),matchMedia("(display-mode: standalone)").matches||navigator.standalone||document.referrer.includes("android-app://")||history.pushState(null,document.title,t))}}),self.addEventListener("popstate",()=>{$(location.href)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("../sw.js",{scope:"../"})});