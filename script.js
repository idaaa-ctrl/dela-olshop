// Main JavaScript Application for TokoHub

// Konfigurasi Nomor WhatsApp Penjual (Ganti dengan nomor WhatsApp Anda)
const SELLER_PHONE = "6281234567890"; 

// State Aplikasi
let products = [];
let cart = JSON.parse(localStorage.getItem('tokohub_cart')) || [];
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const categoryFilterContainer = document.getElementById('categoryFilterContainer');
const sortSelect = document.getElementById('sortSelect');
const resetFilterBtn = document.getElementById('resetFilterBtn');

// Cart Drawer Elements
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutWaBtn = document.getElementById('checkoutWaBtn');
const custNameInput = document.getElementById('custName');
const custAddressInput = document.getElementById('custAddress');

// Modal Elements
const productModal = document.getElementById('productModal');
const modalCard = document.getElementById('modalCard');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalOrigPrice = document.getElementById('modalOrigPrice');
const modalDesc = document.getElementById('modalDesc');
const modalRating = document.getElementById('modalRating');
const modalSold = document.getElementById('modalSold');
const modalBadge = document.getElementById('modalBadge');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
let selectedProductIdForModal = null;

// Helper: Format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Helper: Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.innerText = message;
    
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
}

// Fetch & Initialize Data
async function init() {
    try {
        const res = await fetch('products.json');
        products = await res.json();
        renderProducts();
        updateCartUI();
        if (window.lucide) {
            lucide.createIcons();
        }
    } catch (err) {
        console.error('Gagal memuat data produk:', err);
    }
}

// Filter and Sort Products
function getFilteredProducts() {
    return products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (currentSort === 'price-low') return a.price - b.price;
        if (currentSort === 'price-high') return b.price - a.price;
        if (currentSort === 'rating') return b.rating - a.rating;
        return a.id - b.id;
    });
}

// Render Products Grid
function renderProducts() {
    const list = getFilteredProducts();

    if (list.length === 0) {
        productGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    productGrid.innerHTML = list.map(product => `
        <div class="product-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
                <div class="relative bg-slate-100 h-48 overflow-hidden cursor-pointer" onclick="openModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    ${product.badge ? `<span class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">${product.badge}</span>` : ''}
                </div>
                <div class="p-4">
                    <div class="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                        <span>${product.rating}</span>
                        <span class="text-slate-400 font-normal ml-1">(${product.sold} terjual)</span>
                    </div>
                    <h3 class="font-bold text-slate-800 text-sm mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition" onclick="openModal(${product.id})">
                        ${product.name}
                    </h3>
                    <div class="flex items-baseline gap-2 mt-2">
                        <span class="text-base font-extrabold text-blue-600">${formatRupiah(product.price)}</span>
                        ${product.originalPrice ? `<span class="text-xs text-slate-400 line-through">${formatRupiah(product.originalPrice)}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="p-4 pt-0">
                <button onclick="addToCart(${product.id})" class="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95">
                    <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" masuk ke keranjang!`);
}

function updateQty(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('tokohub_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartCountBadge.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
                <p class="text-xs font-medium">Keranjang belanja Anda kosong.</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-slate-800 truncate">${item.name}</h4>
                    <p class="text-xs text-blue-600 font-extrabold mt-0.5">${formatRupiah(item.price)}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQty(${item.id}, -1)" class="w-5 h-5 rounded bg-white border border-slate-300 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-100 text-xs">-</button>
                        <span class="text-xs font-bold text-slate-700">${item.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)" class="w-5 h-5 rounded bg-white border border-slate-300 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-100 text-xs">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="p-1 text-slate-400 hover:text-red-500 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
    }

    cartSubtotal.innerText = formatRupiah(totalPrice);
    cartTotal.innerText = formatRupiah(totalPrice);

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Drawer Controls
function openCart() {
    cartDrawer.classList.remove('translate-x-full');
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    cartOverlay.classList.add('opacity-100');
}

function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.remove('opacity-100');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
}

// Modal Controls
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    selectedProductIdForModal = productId;
    modalImg.src = product.image;
    modalTitle.innerText = product.name;
    modalPrice.innerText = formatRupiah(product.price);
    modalOrigPrice.innerText = product.originalPrice ? formatRupiah(product.originalPrice) : '';
    modalDesc.innerText = product.description;
    modalRating.innerText = product.rating;
    modalSold.innerText = product.sold;
    
    if (product.badge) {
        modalBadge.innerText = product.badge;
        modalBadge.classList.remove('hidden');
    } else {
        modalBadge.classList.add('hidden');
    }

    productModal.classList.remove('opacity-0', 'pointer-events-none');
    productModal.classList.add('opacity-100');
    modalCard.classList.remove('scale-95');
    modalCard.classList.add('scale-100');
}

function closeModal() {
    productModal.classList.remove('opacity-100');
    productModal.classList.add('opacity-0', 'pointer-events-none');
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-95');
}

// Checkout via WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }

    const name = custNameInput.value.trim();
    const address = custAddressInput.value.trim();

    if (!name || !address) {
        alert('Silakan lengkapi Nama dan Alamat Pengiriman terlebih dahulu.');
        return;
    }

    let message = `Halo TokoHub, saya ingin memesan barang berikut:\n\n`;
    message += `👤 *Nama:* ${name}\n`;
    message += `📍 *Alamat:* ${address}\n\n`;
    message += `🛍️ *Daftar Pesanan:*\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `${index + 1}. ${item.name} x${item.qty} = ${formatRupiah(itemTotal)}\n`;
    });

    message += `\n💰 *Total Pembayaran:* ${formatRupiah(total)}\n\n`;
    message += `Mohon konfirmasi pesanan dan instruksi pembayaran selengkapnya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${SELLER_PHONE}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
}

// Event Listeners
cartToggleBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
closeModalBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
});

modalAddToCartBtn.addEventListener('click', () => {
    if (selectedProductIdForModal) {
        addToCart(selectedProductIdForModal);
        closeModal();
    }
});

checkoutWaBtn.addEventListener('click', checkoutWhatsApp);

// Search & Filters Listener
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

mobileSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

categoryFilterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        renderProducts();
    }
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
});

resetFilterBtn.addEventListener('click', () => {
    searchQuery = '';
    currentCategory = 'all';
    currentSort = 'default';
    searchInput.value = '';
    mobileSearchInput.value = '';
    sortSelect.value = 'default';
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    renderProducts();
});

// Run Init
init();
