const e=(e,a)=>(1!==(e>>>=0)&&(a+="s"),`${e} ${a}`),a=(e,a)=>e===a?"selected":"",t=()=>{scrollTo({top:0,left:0,behavior:"smooth"})},s=(a=Date.now(),t=Date.now()/1e3)=>{const s=t-a;return s<3600?e(s/60,"minute"):s<86400?e(s/3600,"hour"):e(s/86400,"day")};export default({html:e})=>{const o=({model:a={comments:[]}})=>e`<li class=${a.id?"":"placeholder"} .hidden=${!!a.deleted}><small><a onclick=${t} href=${"../user/?"+a.by}>${a.by||"..."} </a>${s(a.time)} ago</small><div>${e([a.text||"..."])}</div><ul class=comments .hidden=${!a.comments.length}>${a.comments.map(o)}</ul></li>`,i=()=>e`<div class=paginator><a href=#back>&lt;</a> <span>go back</span> <a href=#back style=visibility:hidden>&lt;</a></div>`,l=(a,s,o)=>e`<div class=paginator><a onclick=${t} href=${`../${a}/?${s-1}`} class=${1===s?"hidden":""}>&lt; </a><span>${s}/${o}</span> <a onclick=${t} href=${`../${a}/?${s+1}`} class=${s===o?"hidden":""}>></a></div>`;return{about:()=>import("./about.js").then(({default:a})=>a(e)),header:({header:{current:s,stories:o}})=>e`<header><nav><div class=icon>📰</div><ul>${o.map(o=>e`<li><a onclick=${t} class=${a(s,o)} href=${`../${o}/?1`}>${"job"===o?"jobs":o}</a></li>`)}<li class=about><a onclick=${t} class=${a(s,"about")} href=../about/ >about</a></li></ul></nav></header>`,footer:()=>e`<footer>Powered by <a href=https://github.com/WebReflection/uhtml#readme>µhtml</a> & <a href=https://github.com/HackerNews/API>Hacker News API</a></footer>`,main:(a,o,i,n)=>e`<main class=stories>${l(a,i,n)} ${o.map(({index:a,model:o={}})=>e`<article class=${o.id?"":"placeholder"}><div>${a}</div><div><h2><a onclick=${t} href=${o.url||"../item/?"+o.id}>${o.title||"..."} <small>${(o.hostname||"").replace(/^www\./,"")}</small></a></h2><p>${o.score} points by <a onclick=${t} href=${"../user/?"+o.by}>${o.by} </a>${s(o.time)} ago | <a onclick=${t} href=${"../item/?"+o.id}>${o.descendants||0} comments</a></p></div></article>`)} ${l(a,i,n)}</main>`,details:a=>e`<main class=details>${i()}<article><h2><a href=${a.url}>${a.title} <small>${(a.hostname||"").replace(/^www\./,"")}</small></a></h2><p class=meta>${a.score} points by <a onclick=${t} href=${"../user/?"+a.by}>${a.by} </a>${s(a.time)} ago</p></article><h3>${a.descendants||0} comments</h3><ul .hidden=${!a.comments.length}>${a.comments.map(o)}</ul>${i()}</main>`,profile:({about:a,created:t,id:s,karma:o})=>e`<main class=profile>${i()}<article><h1>${s}</h1><p>... joined <strong>${(e=>{const a=new Date,t=(new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(1e3*e))/864e5;return t<0?"today":t<1?"yesterday":Math.ceil(t)+" days ago"})(t||0)}</strong>, and has <strong>${o}</strong> karma</p><p><a href=${"https://news.ycombinator.com/submitted?id="+s}>submissions</a> / <a href=${"https://news.ycombinator.com/threads?id="+s}>comments</a> / <a href=${"https://news.ycombinator.com/favorites?id="+s}>favourites</a></p><div class=about .hidden=${!a}>${e([a])}</div></article>${i()}</main>`,notFound:()=>e`<main class=not-found><article><h1>Not Found</h1><p>The page you are looking for is not here.</p></article></main>`}};