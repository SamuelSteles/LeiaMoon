const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

const booksDiv = document.getElementById("books");
const readerDiv = document.getElementById("reader");
const capitulosSelect = document.getElementById("capitulos");
const conteudoDiv = document.getElementById("conteudo");

let capitulos = [];
let capAtual = 0;

if (!token) {
  booksDiv.innerHTML = "<p>⚠️ Token não encontrado na URL. Acesse com <code>?token=SEU_TOKEN</code></p>";
} else {
  carregarLivros();
}

function carregarLivros() {
  fetch("https://livros.arvore.com.br/api/v1/books", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(json => {
    booksDiv.innerHTML = "";
    (json.data || []).forEach(book => {
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `<strong>${book.title}</strong><br>${book.author || "Autor desconhecido"}<br>`;
      const btn = document.createElement("button");
      btn.textContent = "📖 Ler";
      btn.onclick = () => abrirLivro(book.id);
      div.appendChild(btn);
      booksDiv.appendChild(div);
    });
  })
  .catch(err => {
    booksDiv.innerHTML = `<p>Erro ao carregar livros: ${err.message}</p>`;
  });
}

function abrirLivro(bookId) {
  booksDiv.classList.add("hidden");
  readerDiv.classList.remove("hidden");

  fetch(`https://livros.arvore.com.br/api/v1/books/${bookId}/chapters`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(json => {
    capitulos = json.data || [];
    capitulosSelect.innerHTML = "";
    capitulos.forEach((cap, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = cap.title;
      capitulosSelect.appendChild(opt);
    });
    capitulosSelect.onchange = () => abrirCapitulo(parseInt(capitulosSelect.value));
    abrirCapitulo(0);
  });
}

function abrirCapitulo(index) {
  capAtual = index;
  const idCap = capitulos[index].id;

  fetch(`https://livros.arvore.com.br/api/v1/chapters/${idCap}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(json => {
    conteudoDiv.innerHTML = json.data.content;
  });
}

function lerTudo() {
  const scroll = () => {
    conteudoDiv.scrollBy(0, 1);
    if (conteudoDiv.scrollTop + conteudoDiv.clientHeight >= conteudoDiv.scrollHeight) {
      if (capAtual + 1 < capitulos.length) {
        abrirCapitulo(++capAtual);
        setTimeout(lerTudo, 1000);
      }
    } else {
      requestAnimationFrame(scroll);
    }
  };
  scroll();
}

function voltar() {
  readerDiv.classList.add("hidden");
  booksDiv.classList.remove("hidden");
}
