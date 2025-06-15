(async()=>{
const urlParams=new URLSearchParams(window.location.search);
const token=urlParams.get("token");
if(!token)return alert("Token ausente na URL. Use ?token=SEU_TOKEN");
const books=await fetch("https://livros.arvore.com.br/api/v1/books",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(j=>j.data);
const container=document.createElement("div");
Object.assign(container.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",background:"#111",color:"#fff",zIndex:"99999",overflow:"auto",padding:"20px",fontFamily:"sans-serif"});
const list=document.createElement("div");
books.forEach(b=>{
const d=document.createElement("div");
d.style.marginBottom="20px";
d.innerHTML=`<h2>${b.title}</h2><p>${b.author||"Autor desconhecido"}</p>`;
const btn=document.createElement("button");
btn.textContent="📖 Ler";
btn.style.padding="10px";
btn.onclick=()=>abrirLivro(b.id,b.title);
d.appendChild(btn);
list.appendChild(d);
});
container.appendChild(list);
document.body.appendChild(container);
let capitulos=[],capAtual=0,conteudo;
function abrirLivro(id,titulo){
list.style.display="none";
const sel=document.createElement("select"),area=document.createElement("div"),lerTudo=document.createElement("button"),voltar=document.createElement("button"),tituloH=document.createElement("h2");
Object.assign(sel.style,{padding:"10px",marginBottom:"10px"});
Object.assign(area.style,{height:"70vh",overflowY:"auto",border:"1px solid #fff",padding:"20px",marginTop:"10px"});
lerTudo.textContent="▶️ Ler tudo";lerTudo.style.margin="10px";
voltar.textContent="🔙 Voltar";voltar.style.margin="10px";
tituloH.textContent=titulo;
container.append(tituloH,sel,lerTudo,voltar,area);
conteudo=area;
voltar.onclick=()=>{container.innerHTML="";container.appendChild(list);list.style.display="block"};
fetch(`https://livros.arvore.com.br/api/v1/books/${id}/chapters`,{headers:{Authorization:`Bearer ${token}`}})
.then(r=>r.json()).then(j=>{
capitulos=j.data||[];
capitulos.forEach((c,i)=>{const o=document.createElement("option");o.value=i;o.textContent=c.title;sel.appendChild(o)});
sel.onchange=()=>abrirCapitulo(parseInt(sel.value));
abrirCapitulo(0);
});
lerTudo.onclick=lerTudoAuto;
}
function abrirCapitulo(i){
capAtual=i;
fetch(`https://livros.arvore.com.br/api/v1/chapters/${capitulos[i].id}`,{headers:{Authorization:`Bearer ${token}`}})
.then(r=>r.json()).then(j=>{conteudo.innerHTML=j.data.content});
}
function lerTudoAuto(){
const scroll=()=>{conteudo.scrollBy(0,1);
if(conteudo.scrollTop+conteudo.clientHeight>=conteudo.scrollHeight){
if(capAtual+1<capitulos.length){
abrirCapitulo(++capAtual);setTimeout(lerTudoAuto,1000);
}}else{requestAnimationFrame(scroll)}};
scroll();
}
})();
