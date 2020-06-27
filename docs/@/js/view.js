const e=(a=[])=>a.reduce((a,t)=>a+e((t.model||{}).comments),a.length),a=(e,a)=>(1!==(e>>>=0)&&(a+="s"),`${e} ${a}`),t=(e,a)=>e===a?"selected":"",o=()=>{scrollTo({top:0,left:0,behavior:"smooth"})};let s=0;const l=new Map,n=(e=Date.now(),t=Date.now()/1e3)=>{const o=t-e;return o<3600?a(o/60,"minute"):o<86400?a(o/3600,"hour"):a(o/86400,"day")};export default({html:a})=>{const r=({model:t={comments:[]}})=>a`
<li class=${t.id?"":"placeholder"} .hidden=${!!t.deleted}>
<small>
<a onclick=${o} href=${"../user/?"+t.by}>${t.by||"..."}</a>
${n(t.time)} ago
<a href=#collapse data-count=${e(t.comments)} />
</small>
<div>
${a(l.get(t.text||"...")||(e=>{s||(s=setTimeout(()=>{s=0,l.clear()},1e4));const a=[e];return l.set(e,a),a})(t.text||"..."))}
</div>
<ul class=comments .hidden=${!t.comments.length}>
${t.comments.map(r)}
</ul>
</li>
`,i=()=>a`
<div class=paginator>
<a href=#back>&lt;</a>
<span>go back / share</span>
<a href=#share>📤</a>
</div>
`,c=(e,t,s)=>a`
<div class=paginator>
<a onclick=${o} href=${`../${e}/?${t-1}`} class=${1===t?"hidden":""}>
&lt;
</a>
<span>${t}/${s}</span>
<a onclick=${o} href=${`../${e}/?${t+1}`} class=${t===s?"hidden":""}>
>
</a>
</div>
`;return{about:()=>import("./about.js").then(({default:e})=>e(a)),header:({header:{current:e,stories:s}})=>a`
<header>
<nav>
<div class=icon>📰</div>
<ul>
${s.map(s=>a`
<li>
<a onclick=${o} class=${t(e,s)} href=${`../${s}/?1`}>
${"job"===s?"jobs":s}
</a>
</li>`)}
<li class=about>
<a onclick=${o} class=${t(e,"about")} href=../about/ >
about
</a>
</li>
</ul>
</nav>
</header>
`,footer:()=>a`
<footer>
Powered by
<a href=https://github.com/WebReflection/uhtml#readme>µhtml</a>
&
<a href=https://github.com/HackerNews/API>Hacker News API</a>
</footer>
`,main:(e,t,s,l)=>a`
<main class=stories>
${c(e,s,l)} ${t.map(({index:e,model:t={}})=>a`
<article class=${t.id?"":"placeholder"}>
<div>${e}</div>
<div>
<h2>
<a onclick=${t.url?Object:o} href=${t.url||"../item/?"+t.id} target=${t.url?"_blank":"_self"} rel=noopener>${t.title||"..."}
<small>
${(t.hostname||"").replace(/^www\./,"")}
</small>
</a>
</h2>
<p>
${t.score} points by
<a onclick=${o} href=${"../user/?"+t.by}>${t.by}</a>
${n(t.time)} ago |
<a class=nowrap onclick=${o} href=${"../item/?"+t.id}>${t.descendants||0} comments</a>
</p>
</div>
</article>
`)} ${c(e,s,l)}
</main>
`,details:e=>a`
<main class=details>
${i()}
<article>
<h2>
<a href=${e.url} target=${e.url?"_blank":"_self"} rel=noopener>
${e.title}
<small>${(e.hostname||"").replace(/^www\./,"")}</small>
</a>
</h2>
<p class=meta>
${e.score} points by
<a onclick=${o} href=${"../user/?"+e.by}>${e.by}</a>
${n(e.time)} ago
</p>
</article>
<h3>
${e.descendants||0} comments
</h3>
<ul .hidden=${!e.comments.length}>
${e.comments.map(r)}
</ul>
${i()}
</main>
`,profile:({about:e,created:t,id:o,karma:s})=>a`
<main class=profile>
${i()}
<article>
<h1>${o}</h1>
<p>
... joined <strong>${(e=>{const a=new Date,t=(new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(1e3*e))/864e5;return t<0?"today":t<1?"yesterday":Math.ceil(t)+" days ago"})(t||0)}</strong>, and has <strong>${s}</strong> karma
</p>
<p>
<a href=${"https://news.ycombinator.com/submitted?id="+o} rel=noopener target=_blank>submissions</a> /
<a href=${"https://news.ycombinator.com/threads?id="+o} rel=noopener target=_blank>comments</a> /
<a href=${"https://news.ycombinator.com/favorites?id="+o} rel=noopener target=_blank>favourites</a>
</p>
<div class=about .hidden=${!e}>
${a([e])}
</div>
</article>
${i()}
</main>
`,notFound:()=>a`
<main class=not-found>
${i()}
<article>
<h1>Not Found</h1>
<p>The page you are looking for is not here.</p>
</article>
</main>
`}};