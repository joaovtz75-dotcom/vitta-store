// ===============================
// PRODUTOS
// ===============================

const products = [

    {
        id: 1,
        name: "Camiseta Overshirt Black",
        category: "camisas",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
        description: "Camiseta preta versátil com tecido confortável e acabamento premium."
    },

    {
        id: 2,
        name: "Camiseta Premium White",
        category: "camisas",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f3846?auto=format&fit=crop&w=800&q=85",
        description: "Camiseta branca básica premium para combinações minimalistas."
    },

    {
        id: 3,
        name: "Camiseta Street Brown",
        category: "camisas",
        price: 94.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85",
        description: "Modelo marrom moderno inspirado no estilo streetwear."
    },

    {
        id: 4,
        name: "Calça Cargo Urban",
        category: "calcas",
        price: 149.90,
        oldPrice: 179.90,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85",
        description: "Calça cargo com modelagem moderna e bolsos funcionais."
    },

    {
        id: 5,
        name: "Calça Jeans Black",
        category: "calcas",
        price: 159.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",
        description: "Jeans preto com corte moderno para usar em diversas ocasiões."
    },

    {
        id: 6,
        name: "Bermuda Casual Bege",
        category: "bermudas",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85",
        description: "Bermuda bege leve e confortável para dias quentes."
    },

    {
        id: 7,
        name: "Bermuda Street Black",
        category: "bermudas",
        price: 84.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=800&q=85",
        description: "Bermuda preta com visual urbano e versátil."
    },

    {
        id: 8,
        name: "Boné Vitta Black",
        category: "acessorios",
        price: 59.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85",
        description: "Boné preto minimalista com logo Vitta."
    }

];


// ===============================
// CARRINHO
// ===============================

let cart = [];


// ===============================
// ELEMENTOS
// ===============================

const productsGrid =
    document.getElementById("productsGrid");

const cartButton =
    document.getElementById("cartButton");

const closeCart =
    document.getElementById("closeCart");

const cartElement =
    document.getElementById("cart");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const searchButton =
    document.getElementById("searchButton");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");


// ===============================
// FORMATAR PREÇO
// ===============================

function formatPrice(price) {

    return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ===============================
// MOSTRAR PRODUTOS
// ===============================

function renderProducts(list = products) {

    productsGrid.innerHTML = "";

    if (list.length === 0) {

        productsGrid.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;padding:50px">
                Nenhum produto encontrado.
            </p>
        `;

        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div>

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    ${
                        product.oldPrice
                        ?
                        `
                        <span class="product-old-price">
                            ${formatPrice(product.oldPrice)}
                        </span>
                        `
                        :
                        ""
                    }

                </div>

                <div class="product-buttons">

                    <button
                        class="view-button"
                        onclick="openProductModal(${product.id})"
                    >
                        Ver
                    </button>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Comprar
                    </button>

                </div>

            </div>
        `;

        productsGrid.appendChild(card);

    });

}


// ===============================
// ADICIONAR AO CARRINHO
// ===============================

function addToCart(id) {

    const product =
        products.find(item => item.id === id);

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    openCart();

}


// ===============================
// REMOVER DO CARRINHO
// ===============================

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    updateCart();

}


// ===============================
// ATUALIZAR CARRINHO
// ===============================

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
        `;

    }

    let total = 0;

    let quantity = 0;

    cart.forEach(item => {

        total +=
            item.price * item.quantity;

        quantity +=
            item.quantity;

        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${item.quantity}x
                    ${formatPrice(item.price)}
                </p>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${item.id})"
                >
                    Remover
                </button>

            </div>
        `;

        cartItems.appendChild(div);

    });

    cartTotal.textContent =
        formatPrice(total);

    cartCount.textContent =
        quantity;

}


// ===============================
// ABRIR CARRINHO
// ===============================

function openCart() {

    cartElement.classList.add("active");

    cartOverlay.classList.add("active");

}


// ===============================
// FECHAR CARRINHO
// ===============================

function closeCartFunction() {

    cartElement.classList.remove("active");

    cartOverlay.classList.remove("active");

}

cartButton.addEventListener(
    "click",
    openCart
);

closeCart.addEventListener(
    "click",
    closeCartFunction
);

cartOverlay.addEventListener(
    "click",
    closeCartFunction
);


// ===============================
// BUSCA
// ===============================

searchButton.addEventListener(
    "click",
    () => {

        searchBox.classList.toggle("active");

        if (searchBox.classList.contains("active")) {

            searchInput.focus();

        }

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const search =
            searchInput.value
            .toLowerCase()
            .trim();

        const filtered =
            products.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

            );

        renderProducts(filtered);

    }
);


// ===============================
// CATEGORIAS
// ===============================

const categoryButtons =
    document.querySelectorAll(
        ".category-buttons button"
    );

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.dataset.category;

            if (category === "todos") {

                renderProducts(products);

            } else {

                const filtered =
                    products.filter(
                        product =>
                            product.category === category
                    );

                renderProducts(filtered);

            }

        }
    );

});


// ===============================
// ORDENAR
// ===============================

document
    .getElementById("sortProducts")
    .addEventListener(
        "change",
        function () {

            let sorted =
                [...products];

            if (this.value === "lowest") {

                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }

            if (this.value === "highest") {

                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }

            renderProducts(sorted);

        }
    );


// ===============================
// MODAL
// ===============================

let selectedProduct = null;

function openProductModal(id) {

    const product =
        products.find(item => item.id === id);

    selectedProduct = product;

    document.getElementById("modalImage")
        .src = product.image;

    document.getElementById("modalImage")
        .alt = product.name;

    document.getElementById("modalCategory")
        .textContent = product.category;

    document.getElementById("modalName")
        .textContent = product.name;

    document.getElementById("modalDescription")
        .textContent = product.description;

    document.getElementById("modalPrice")
        .textContent = formatPrice(product.price);

    document
        .getElementById("productModal")
        .classList.add("active");

}


function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("active");

}


document
    .getElementById("modalAdd")
    .addEventListener(
        "click",
        () => {

            if (selectedProduct) {

                addToCart(selectedProduct.id);

                closeProductModal();

            }

        }
    );


// ===============================
// TAMANHOS
// ===============================

document
    .querySelectorAll(".sizes button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".sizes button")
                    .forEach(btn =>
                        btn.classList.remove("selected")
                    );

                button.classList.add("selected");

            }
        );

    });


// ===============================
// WHATSAPP
// ===============================

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }

            let message =
                "Olá! Quero fazer um pedido:%0A%0A";

            let total = 0;

            cart.forEach(item => {

                const subtotal =
                    item.price * item.quantity;

                total += subtotal;

                message +=
                    `• ${item.name} - ${item.quantity}x - ${formatPrice(subtotal)}%0A`;

            });

            message +=
                `%0ATotal: ${formatPrice(total)}`;

            // TROQUE PELO SEU NÚMERO
            const phone = 77999076670
                "5577999076670";

            const url =
                `https://wa.me/${phone}?text=${message}`;

            window.open(
                url,
                "_blank"
            );

        }
    );


// ===============================
// NEWSLETTER
// ===============================

document
    .getElementById("newsletterForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            alert(
                "Cadastro realizado com sucesso!"
            );

            event.target.reset();

        }
    );


// ===============================
// SCROLL
// ===============================

function scrollToProducts() {

    document
        .getElementById("produtos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// INICIALIZAR
// ===============================

renderProducts();

updateCart();