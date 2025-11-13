//Substitua pela sua chave REAL da OMDB API
const OMDB_API_KEY = '48435082';
const listaFilmesContainer = document.querySelector('.lista-filmes');
const searchInput = document.querySelector('.search-input');

// --- A. Função para Criar o HTML do Card ---
/**
 * Criar o elemento HTML de um Card de FIlme com os dados da OMDB.
 * @param {object} filme - Objeto de filme retornado pela API.
 */
function criarCardFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('card-filme');
    // Adicionar o IMDB ID como um data-atribute para buscar detalhes/trailer depois
    card.dataset.imdbId = filme.imdbID;

    // Garante que p rating seja um valor presente
    const rating = filme.imdbRating ? `⭐ ${filme.imdbRating}` : `⭐ N/A`;

    // Conteúdo HTML do card, usando as novas classes CSS
    card.innerHTML = `
    <img src ="${filme.Poster !== 'N/A' ? filme.Poster : 'placeholder.jpg'}"
         alt="${filme.Title}"
         class="poster-filme">
    <span class="avaliacao">${rating}</span>
    <div class="card-detalhes">
         <h3 class="titulo-filme">${filme.Title} (${filme.Year})</h3>
         <button class="botao-adicionar" data-title="${filme.Title}">
             + Minha Lista
        </button>
    </div>
    `;

    // Adicionar um listener para a funcionalidade de traile (Se você tiver a API)
    // Se você usar a OMDB, precisará de uma segunda chamada para os detalhes
    card.addEventListener('click', () => buscarEExibirDetalhes(filme.imdbID));

    return card;
}

// --- B. Função Principal de Busca ---
/**
 * Buscar o filme na OMDB e atualizar o container,
 * @param {string} termo - Termo de Busca digital pelo usuário.
 */
async function buscarFilmes(termo) {
    if (!termo) return; // Não busca se o campo estiver vazio

    // Limpa a lista anterior e mostra um indicador de carregamento
    listaFilmesContainer.innerHTML = '<p style="text-align: center; color: gray;">Carregando...</p>';

    try {
        // Buscar na OMDB (O parâmetro 's' é para buscar por termo)
        const responder = await fetch(`https://www.omdbapi.com/?s=${termo}&apikey=${OMDB_API_KEY}`);
        const data = await responder.json();

        // Limpa o container novamente
        listaFilmesContainer.innerHTML = '';

        if (data.Response === 'True' && data.Search) {
            data.Search.forEach(async (filmeBase) => {
                // A OMDB retorna apenas dados básicos na busca (s=)
                // Precisamos de uma segunda busca (i=) para pegar o Rating.
                const filmeDetalhado = await buscarDetalhes(filmeBase.imdbID)
                if (filmeDetalhado) {
                    listaFilmesContainer.appendChild(criarCardFilme(filmeDetalhado));
                }
            });
        } else {
            listaFilmesContainer.innerHTML = `<p style="text-align: center;">Nenhum filme encontrado para "${termo}".</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar filme:", error);
        listaFilmesContainer.innerHTML = '<p style="text-align: center; color: red;">Erro na conexão com a API.</p>';
    }
}

// --- C. Função para Buscar Detalhes e Trailer (Chamada Adicional) ---
// É NECESSÁria pois a OMDB não retorna o Rating na busca por 's'
async function buscarDetalhes(imdbID) {
    try {
        // Buscar na OMDB (O parametro 'i' é para buscar por ID)
        const responder = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
        const data = await responder.json();
        return data.Response === 'True' ? data : null;
    } catch (error) {
        console.error("Erro ao bucar detalhes:", error);
        return null;
    }
}


// --- D. Lógica para exibir detalhes/trailer (Implementação do Modal) ---
// Se você usava uma API diferente para trailer, integre-a aqui.
function buscarEExibirDetalhes(imdbID) {
    // 1. Você faria uma nova busca (na OMDB ou em outra API como a TheMovieDB/Youtube)
    //    para obter o link do trailer ou mais detalhes.

    // 2. Você criara um elemento de Modal (janela pop-up) com trailer/detalhes.

    alert(`Funcionalidade de Detalhes/Trailer para o ID: ${imdbID} (Ainda precisa ser implementada).`);
    // Exemplo de como exibir um link se você tiver o URL de trailer:
    // window.open('LINK_DO_TRAILER', '_blank');
}


// --- E. Implementação do DEBOUNCE na busca ---
// Isso evita chamar a API a cada tecla digitada.
let searchTimeout;
searchInput.addEventListener('input', (event) => {
    //Limpar o timeout anterior para evitar chamadas múltiplas
    clearTimeout(searchTimeout);

    // Define um novo timeout para buscar após 500 milisegundos (0.5s)
    searchTimeout = setTimeout(() => {
        buscarFilmes(event.target.value.trim());
    }, 500);
});

// Exemplo de carregamento inicial
document.addEventListener('DOMContainerLoaded', () => {
    //Buscar filmes ao carregar a página (EX: eo mais recentes)
    buscarFilmes('popular');
});