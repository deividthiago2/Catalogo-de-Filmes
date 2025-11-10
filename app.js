//Substitua pela sua chave REAL da OMDB API
const OMDB_API_KEY = 'coloque sua chave aqui';
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
}