let cards = document.querySelector("#cards");
let pesquisaInput = document.querySelector("#pesquisa");
("#carregarPersonagens");
const url = "https://thronesapi.com/api/v2/Characters";

const fetchPersonagens = () => {
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
      const stringPesqusa = e.target.value.toLowerCase();
      const filtrarPersonagens = personagens.filter((dado) => {
        return `${dado.name}`.toLowerCase().includes(stringPesqusa);
      });
      cards.innerHTML = telaPersonagens(filtrarPersonagens);
    });
    cards.innerHTML = telaPersonagens(personagens);
    categoriasPersonagens("todos");
  });
};
fetchPersonagens();




