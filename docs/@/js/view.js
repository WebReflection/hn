const a=(a,e)=>(1!==(a>>>=0)&&(e+="s"),`${a} ${e}`),e=(a,e)=>a===e?"selected":"",t=()=>{scrollTo({top:0,left:0,behavior:"smooth"})},s=(e=Date.now(),t=Date.now()/1e3)=>{const s=t-e;return s<3600?a(s/60,"minute"):s<86400?a(s/3600,"hour"):a(s/86400,"day")};export default({html:a})=>{const o=({model:e={comments:[]}})=>a`<li class=${e.id?"":"placeholder"} .hidden=${!!e.deleted}><small><a onclick=${t} href=${"../user/?"+e.by}>${e.by||"..."} </a>${s(e.time)} ago</small><div>${a([e.text||"..."])}</div><ul class=comments .hidden=${!e.comments.length}>${e.comments.map(o)}</ul></li>`,i=()=>a`<div class=paginator><a href=#back>&lt;</a> <span>go back / share</span> <a href=#share>📤</a></div>`,l=(e,s,o)=>a`<div class=paginator><a onclick=${t} href=${`../${e}/?${s-1}`} class=${1===s?"hidden":""}>&lt; </a><span>${s}/${o}</span> <a onclick=${t} href=${`../${e}/?${s+1}`} class=${s===o?"hidden":""}>></a></div>`;return{about:()=>import("./about.js").then(({default:e})=>e(a)),header:({header:{current:s,stories:o}})=>a`<header><nav><div class=icon>📰</div><ul>${o.map(o=>a`<li><a onclick=${t} class=${e(s,o)} href=${`../${o}/?1`}>${"job"===o?"jobs":o}</a></li>`)}<li class=about><a onclick=${t} class=${e(s,"about")} href=../about/ >about</a></li></ul></nav></header>`,footer:()=>a`<footer>Powered by <a href=https://github.com/WebReflection/uhtml#readme>µhtml</a> & <a href=https://github.com/HackerNews/API>Hacker News API</a></footer>`,main:(e,o,i,n)=>a`<main class=stories>${l(e,i,n)} ${o.map(({index:e,model:o={}})=>a`<article class=${o.id?"":"placeholder"}><div>${e}</div><div><h2><a onclick=${t} href=${o.url||"../item/?"+o.id}>${o.title||"..."} <small>${(o.hostname||"").replace(/^www\./,"")}</small></a></h2><p>${o.score} points by <a onclick=${t} href=${"../user/?"+o.by}>${o.by} </a>${s(o.time)} ago | <a class=nowrap onclick=${t} href=${"../item/?"+o.id}>${o.descendants||0} comments</a></p></div></article>`)} ${l(e,i,n)}</main>`,details:e=>a`<main class=details>${i()}<article><h2><a href=${e.url}>${e.title} <small>${(e.hostname||"").replace(/^www\./,"")}</small></a></h2><p class=meta>${e.score} points by <a onclick=${t} href=${"../user/?"+e.by}>${e.by} </a>${s(e.time)} ago</p></article><h3>${e.descendants||0} comments</h3><ul .hidden=${!e.comments.length}>${e.comments.map(o)}</ul>${i()}</main>`,profile:({about:e,created:t,id:s,karma:o})=>a`<main class=profile>${i()}<article><h1>${s}</h1><p>... joined <strong>${(a=>{const e=new Date,t=(new Date(e.getFullYear(),e.getMonth(),e.getDate())-new Date(1e3*a))/864e5;return t<0?"today":t<1?"yesterday":Math.ceil(t)+" days ago"})(t||0)}</strong>, and has <strong>${o}</strong> karma</p><p><a href=${"https://news.ycombinator.com/submitted?id="+s}>submissions</a> / <a href=${"https://news.ycombinator.com/threads?id="+s}>comments</a> / <a href=${"https://news.ycombinator.com/favorites?id="+s}>favourites</a></p><div class=about .hidden=${!e}>${a([e])}</div></article>${i()}</main>`,notFound:()=>a`<main class=not-found>${i()}<article><h1>Not Found</h1><p>The page you are looking for is not here.</p></article></main>`}};