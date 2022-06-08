let personagensFavoritos = [];
let cards = document.querySelector("#cards");
let detalhes = document.querySelector("#detalhes");
let url = "https://thronesapi.com/api/v2/Characters";
let pesquisaInput = document.querySelector("#pesquisa");
let btnfavoritos = document.getElementById("favoritos");
let btnPersonagens = document.querySelector("#carregarPersonagens");

// Personagens
function fetchPersonagens() {
  const promises = [];
  for (let id = 1; id <= 52; id++) {
    const todosPersonagens = `https://thronesapi.com/api/v2/Characters/${id}`;
    promises.push(fetch(todosPersonagens).then((resposta) => resposta.json()));
  }
  Promise.all(promises).then((resultados) => {
    const personagens = resultados.map((dados) => ({
      id: dados.id,
      name: dados.fullName,
      img: dados.imageUrl,
      family: dados.family,
      title: dados.title,
    }));
    pesquisaInput.addEventListener("keyup", (e) => {
      const stringPesquisa = e.target.value.toLowerCase();
      const pesquisarPersonagens = personagens.filter((dado) => {
        return `${dado.name}`.toLowerCase().includes(stringPesquisa);
      });
      cards.innerHTML = telaPersonagens(pesquisarPersonagens);
    });
    cards.innerHTML = telaPersonagens(personagens);
    categoriasPersonagens("todos");
  });
}
fetchPersonagens();

function telaPersonagens(personagens) {
  const localStorage = consultarLocalStorage();
  return personagens
    .map((dado) => {
      let iconFav = localStorage.find((item) => item.id === dado.id)
        ? "fav"
        : "";
      return `<div class="card">
              <img class="imgPersonagens" src="${dado.img}" />
              <div class="cardDados">   
                  <h1 id="nomePersonagem" onclick='personagensCard(${JSON.stringify(
                    dado
                  )})'>${dado.name}</h1>
                  <div class="favorite ${iconFav}" id="favoritar" onClick='favoritarPersonagens(${JSON.stringify(
        dado
      )}); this.classList.toggle("fav")'></div>
              </div>
            </div>`;
    })
    .join("");
}

function personagensCard(dado) {
  detalhes.classList.add("detalhes");
  return (detalhes.innerHTML = `<div class="cardDetalhes">
    <div class="fechar">
    <img onclick="fecharCard()" src="src/assets/icons/close.svg"/>
    </div>
    <h1>${dado.name}</h1>
    <div class="dadosDetalhes">
    <p>Seu título: ${dado.title}</p>
        <p>Sua família: ${dado.family}</p>
      </div>
  </div>`);
}

function fecharCard() {
  detalhes.classList.remove("detalhes");
  detalhes.innerHTML = "";
}

// Favoritar

function favoritarPersonagens(dado) {
  personagensFavoritos = consultarLocalStorage();

  const adicionarFavoritos = personagensFavoritos.filter(
    (item) => item.id === dado.id
  );

  if (adicionarFavoritos.length === 0) {
    personagensFavoritos.push(dado);
  } else {
    personagensFavoritos = personagensFavoritos.filter(
      (item) => item.id != dado.id
    );
  }
  localStorage.setItem("favoritos", JSON.stringify(personagensFavoritos));
}

function consultarLocalStorage() {
  if (localStorage.getItem("favoritos") == null) {
    localStorage.setItem("favoritos", "[]");
  }
  const dadosFavoritos = localStorage.getItem("favoritos");
  return JSON.parse(dadosFavoritos);
}

function carregarFavoritos() {
  const carregarPersonagensFavoritos = consultarLocalStorage();
  cards.innerHTML = telaPersonagens(carregarPersonagensFavoritos);
}

// Categorias Personagens
function categoriasPersonagens(value) {
  let buttons = document.querySelectorAll(".btnCategoria");
  buttons.forEach((button) => {
    if (value.toUpperCase() == button.innerText.toUpperCase()) {
      button.classList.add("ativado");
    } else {
      button.classList.remove("ativado");
    }
  });

  let elementosCard = document.querySelectorAll(".card");
  elementosCard.forEach((elementoCard) => {
    if (value == "todos") {
      elementoCard.classList.remove("esconder");
    } else {
      if (elementoCard.innerText.match(value)) {
        elementoCard.classList.remove("esconder");
      } else {
        elementoCard.classList.add("esconder");
      }
    }
  });
}

// Efeitos e ações

btnfavoritos.addEventListener("click", carregarFavoritos);
btnPersonagens.addEventListener("click", fetchPersonagens);

function abrirMenu() {
  let nav = document.getElementById("navFechado");
  nav.classList.toggle("navAberto");
}
