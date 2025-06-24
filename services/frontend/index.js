// Função para criar e retornar um elemento HTML representando um produto
function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';

    div.innerHTML = `
    <div class="card is-shady">
        <div class="card-image">
            <figure class="image is-4by3">
                <img
                     src="${book.photo}"
                     alt="${book.name}"
                     class="modal-button"
                />
            </figure>
        </div>

        <div class="card-content">
            <div class="content book" data-id="${book.id}">
                <div class="book-meta">
                    <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                    <p class="is-size-6">Disponível em estoque: ${book.quantity}</p>
                    <h4 class="is-size-3 title">${book.name}</h4>
                    <p class="subtitle">${book.author}</p>
                </div>

                <div class="field has-addons">
                    <div class="control">
                        <input class="input cep-input" type="text" placeholder="Digite o CEP"/>
                    </div>

                    <div class="control">
                        <a class="button button-shipping is-info" data-id="${book.id}">Calcular Frete</a>
                    </div>
                </div>

                <button class="button button-buy is-fullwidth">Comprar</button>

                <button class="button button-search is-fullwidth mt-2" data-id="${book.id}">Pesquisar Livro</button>
            </div>
        </div>
    </div>`;

    return div;
}

// Função para calcular o frete com base no CEP
function calculateShipping(cep) {
    return fetch(`http://localhost:3000/shipping/${cep}`)
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Erro na requisição do frete');
        });
}

// Função para buscar produto por ID
function searchProductById(id) {
    return fetch(`http://localhost:3000/product/${id}`)
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Produto não encontrado');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');

    // Carrega todos os livros
    fetch('http://localhost:3000/products')
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Erro ao carregar produtos');
        })
        .then((data) => {
            data.forEach((book) => {
                books.appendChild(newBook(book));
            });

            // Evento para calcular frete
            document.querySelectorAll('.button-shipping').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const cepInput = e.target.closest('.book').querySelector('.cep-input');
                    const cep = cepInput.value.trim();

                    if (!cep) {
                        swal('Aviso', 'Por favor, digite um CEP válido.', 'warning');
                        return;
                    }

                    calculateShipping(cep)
                        .then((data) => {
                            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
                        })
                        .catch(() => {
                            swal('Erro', 'Erro ao consultar frete', 'error');
                        });
                });
            });

            // Evento para compra (simples)
            document.querySelectorAll('.button-buy').forEach((btn) => {
                btn.addEventListener('click', () => {
                    swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                });
            });

            // Evento para buscar produto por ID (botão "Pesquisar Livro")
            document.querySelectorAll('.button-search').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');

                    searchProductById(id)
                        .then((product) => {
                            swal({
                                title: product.name,
                                text: `Autor: ${product.author}\nPreço: R$${product.price.toFixed(2)}\nQuantidade: ${product.quantity}`,
                                icon: product.photo,
                                buttons: true,
                            });
                        })
                        .catch(() => {
                            swal('Erro', 'Produto não encontrado', 'error');
                        });
                });
            });
        })
        .catch(() => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
        });
});
