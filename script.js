document.addEventListener('DOMContentLoaded', function () {
    const itemInput = document.getElementById('itemInput');
    const addButton = document.getElementById('addButton');
    const listaCompras = document.getElementById('listaCompras');
    const clearAllButton = document.getElementById('clearAll');
    const reverseListButton = document.getElementById('reverseList');
    const loadSlotButtons = document.querySelectorAll('.load-slot');
    const explosaoMensagem = document.getElementById('explosaoMensagem');

    let currentSlot = 1; // Slot padrão

    // Contador de cliques
    let clickCount = 0;
    const clickCountElement = document.getElementById('clickCount');

    // Função para incrementar o contador
    function incrementClickCounter() {
        clickCount++;
        clickCountElement.textContent = clickCount;
        // Salva no localStorage
        localStorage.setItem('totalClicks', clickCount);
    }

    // Event listener para cliques em qualquer elemento clicável
    document.addEventListener('click', function(event) {
        // Verifica se o elemento clicado é clicável (botões, links, inputs, etc.)
        if (event.target.tagName === 'BUTTON' || 
            event.target.tagName === 'A' || 
            event.target.tagName === 'INPUT' || 
            event.target.isContentEditable) {
            incrementClickCounter();
        }
    });

    // Carrega o contador salvo ao iniciar
    if (localStorage.getItem('totalClicks')) {
        clickCount = parseInt(localStorage.getItem('totalClicks'));
        clickCountElement.textContent = clickCount;
    }

    // Carregar itens do LocalStorage (slot 1 inicialmente)
    carregarItens(currentSlot);

    // Event listener para adicionar item (botão ou Enter)
    addButton.addEventListener('click', adicionarItem);
    itemInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            adicionarItem();
        }
    });

    // Event listener para apagar todos os itens
    clearAllButton.addEventListener('click', function () {
        if (confirm('Tem certeza que deseja apagar todos os itens?')) {
            listaCompras.innerHTML = '';
            salvarItens(currentSlot);
        }
    });

    // Event listener para inverter a ordem da lista
    reverseListButton.addEventListener('click', function () {
        const items = Array.from(listaCompras.children);
        listaCompras.innerHTML = '';
        items.reverse().forEach(item => listaCompras.appendChild(item));
        salvarItens(currentSlot);
    });

    // Event listeners para os botões de slot
    loadSlotButtons.forEach(button => {
        button.addEventListener('click', function () {
            const slot = this.getAttribute('data-slot');
            if (slot != currentSlot) {
                currentSlot = slot;
                carregarItens(slot);
                updateActiveSlotButton();
            }
        });
    });

    function adicionarItem() {
        const itemTexto = itemInput.value.trim();
        if (itemTexto !== '') {
            // Verifica se é "pão seguro" para criar um pão normal
            /* if (itemTexto.toLowerCase() === 'pão seguro') {
                // Cria um item normal chamado "pão"
                const item = document.createElement('li');
                item.className = 'item';

                const itemSpan = document.createElement('span');
                itemSpan.textContent = 'pão';

                const deleteButton = document.createElement('button');
                deleteButton.className = 'deleteButton';
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', function () {
                    item.remove();
                    salvarItens(currentSlot);
                });

                item.appendChild(itemSpan);
                item.appendChild(deleteButton);

                listaCompras.appendChild(item);

                // Limpar input
                itemInput.value = '';

                // Salvar automaticamente no slot atual
                salvarItens(currentSlot);
                return;
            } */

            // Easter egg: se o item for "pão explosivo", explode a lista
            if (itemTexto.toLowerCase() === 'pão explosivo') {
                listaCompras.innerHTML = '';
                salvarItens(currentSlot);

                // Mostra mensagem de explosão
                explosaoMensagem.style.display = 'block';
                setTimeout(() => {
                    explosaoMensagem.style.display = 'none';
                }, 2000);

                itemInput.value = '';
                return;
            }

            // Criar elemento do item normal
            const item = document.createElement('li');
            item.className = 'item';

            const itemSpan = document.createElement('span');
            itemSpan.textContent = itemTexto;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'deleteButton';
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', function () {
                item.remove();
                salvarItens(currentSlot);
            });

            item.appendChild(itemSpan);
            item.appendChild(deleteButton);

            listaCompras.appendChild(item);

            // Limpar input
            itemInput.value = '';

            // Salvar automaticamente no slot atual
            salvarItens(currentSlot);
        }
    }

    function salvarItens(slot) {
        const itens = [];
        document.querySelectorAll('#listaCompras .item span').forEach(function (item) {
            itens.push(item.textContent);
        });
        localStorage.setItem(`listaCompras_slot_${slot}`, JSON.stringify(itens));
    }

    function carregarItens(slot) {
        const itensSalvos = localStorage.getItem(`listaCompras_slot_${slot}`);
        listaCompras.innerHTML = '';

        if (itensSalvos) {
            JSON.parse(itensSalvos).forEach(function (itemTexto) {
                const item = document.createElement('li');
                item.className = 'item';

                const itemSpan = document.createElement('span');
                itemSpan.textContent = itemTexto;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'deleteButton';
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', function () {
                    item.remove();
                    salvarItens(currentSlot);
                });

                item.appendChild(itemSpan);
                item.appendChild(deleteButton);

                listaCompras.appendChild(item);
            });
        }

        updateActiveSlotButton();
    }

    function updateActiveSlotButton() {
        loadSlotButtons.forEach(button => {
            if (button.getAttribute('data-slot') === currentSlot.toString()) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
});