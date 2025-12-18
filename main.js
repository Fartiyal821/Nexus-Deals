/**
 * NEXUS DEALS - VANILLA ENGINE
 * Core logic for state management, rendering, and conversion optimization.
 */

// --- CONFIG & STATE ---
const STATE = {
    view: 'home', // 'home' or 'builder'
    category: 'All',
    search: '',
    products: [],
    compareList: [],
    loading: true
};

const CATEGORIES = ['All', 'GPU', 'CPU', 'Monitor', 'RAM', 'Storage', 'Case', 'PSU'];

const MOCK_DEALS = [
    { id: '1', name: 'ZOTAC RTX 4070 Super Twin Edge', category: 'GPU', price: 61999, originalPrice: 66999, retailer: 'Amazon', rating: 4.8, reviews: 156, features: ['12GB GDDR6X', 'DLSS 3.5'], image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400' },
    { id: '2', name: 'AMD Ryzen 7 7800X3D', category: 'CPU', price: 36999, originalPrice: 44999, retailer: 'Newegg', rating: 4.9, reviews: 3240, features: ['Best Gaming CPU', '3D V-Cache'], image: 'https://images.unsplash.com/photo-1555616635-640b71bd185e?w=400' },
    { id: '3', name: 'LG 27" Ultragear OLED 240Hz', category: 'Monitor', price: 78999, originalPrice: 99999, retailer: 'Amazon', rating: 4.6, reviews: 580, features: ['OLED Panel', '240Hz'], image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400' },
    { id: '4', name: 'Samsung 990 PRO 2TB NVMe', category: 'Storage', price: 16999, originalPrice: 22999, retailer: 'Amazon', rating: 4.9, reviews: 8600, features: ['7450 MB/s', 'PCIe 4.0'], image: 'https://images.unsplash.com/photo-1628123018259-2c97486e033e?w=400' }
];

// --- UTILITIES ---
const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const addToast = (title, message, type = 'info') => {
    const container = document.getElementById('toasts');
    const id = 'toast-' + Date.now();
    const bg = type === 'success' ? 'border-green-500/30' : (type === 'warning' ? 'border-orange-500/30' : 'border-nexus-accent/30');
    const icon = type === 'success' ? 'check-circle' : (type === 'warning' ? 'alert-triangle' : 'bell');
    
    const html = `
        <div id="${id}" class="flex items-start gap-3 p-4 rounded-xl border glass shadow-2xl min-w-[320px] pointer-events-auto animate-bounce-in">
            <i data-lucide="${icon}" class="mt-0.5 ${type === 'success' ? 'text-green-400' : 'text-nexus-accent'}"></i>
            <div class="flex-1">
                <h4 class="text-sm font-bold text-white mb-1">${title}</h4>
                <p class="text-xs text-slate-300">${message}</p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-white">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', html);
    lucide.createIcons();
    setTimeout(() => document.getElementById(id)?.remove(), 5000);
};

// --- RENDERERS ---
const renderHeader = () => {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('home')">
                <div class="bg-nexus-accent p-1.5 rounded-lg">
                    <i data-lucide="monitor-play" class="text-white"></i>
                </div>
                <h1 class="font-display font-bold text-2xl text-white">NEXUS<span class="text-nexus-accent">DEALS</span></h1>
            </div>
            <nav class="hidden md:flex gap-8">
                <button onclick="navigate('home')" class="text-sm font-medium ${STATE.view === 'home' ? 'text-nexus-accent' : 'text-slate-400'}">Daily Deals</button>
                <button class="text-sm font-medium text-slate-400">Build Guides</button>
            </nav>
            <button onclick="navigate('builder')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold glass hover:border-nexus-accent transition-all">
                <i data-lucide="sparkles" class="w-4 h-4 text-nexus-accent"></i>
                AI Builder
            </button>
        </div>
    `;
    lucide.createIcons();
};

const renderHero = () => `
    <section class="relative py-20 overflow-hidden border-b border-white/5 bg-nexus-900">
        <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div class="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-nexus-accent text-xs font-bold mb-6">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                LIVE DEAL TRACKER ACTIVE • 2,400 SAVINGS FOUND TODAY
            </div>
            <h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-6">Stop Overpaying <br><span class="text-nexus-accent">For Performance.</span></h1>
            <p class="max-w-xl mx-auto text-slate-400 mb-8">Save up to 40% on RTX 4090s, Ryzens, and high-speed storage with real-time price monitoring.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button onclick="navigate('builder')" class="px-8 py-4 bg-nexus-accent rounded-xl font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all">Start Building Now</button>
                <button class="px-8 py-4 glass rounded-xl font-semibold">View Hot Deals</button>
            </div>
        </div>
    </section>
`;

const renderDealCard = (product) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stock = Math.floor(Math.random() * 8) + 2;
    return `
        <div class="glass group rounded-2xl overflow-hidden flex flex-col hover:border-nexus-accent/50 transition-all duration-300">
            <div class="h-48 relative bg-black/40">
                <img src="${product.image}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform">
                <div class="absolute top-2 right-2 bg-nexus-900/90 text-[10px] font-bold px-2 py-1 rounded text-slate-400 border border-white/10 uppercase">${product.retailer}</div>
                <div class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">-${discount}%</div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
                <div class="text-[10px] font-bold text-nexus-accent uppercase mb-1">${product.category}</div>
                <h3 class="font-bold text-white mb-4 line-clamp-2">${product.name}</h3>
                
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-red-500 animate-pulse" style="width: ${stock * 10}%"></div>
                    </div>
                    <span class="text-[10px] font-bold text-red-400">Only ${stock} left!</span>
                </div>

                <div class="mt-auto">
                    <div class="text-xs text-slate-500 line-through">${formatCurrency(product.originalPrice)}</div>
                    <div class="text-2xl font-display font-bold text-white mb-4">${formatCurrency(product.price)}</div>
                    
                    <a href="#" class="block w-full text-center py-3 bg-nexus-gold hover:bg-nexus-goldHover text-black font-bold rounded-xl transition-all shadow-lg overflow-hidden relative">
                        <span class="relative z-10">CHECK AVAILABILITY</span>
                        <div class="absolute inset-0 bg-white/20 animate-shimmer skew-x-[-20deg]"></div>
                    </a>
                </div>
            </div>
        </div>
    `;
};

const renderHome = () => {
    const container = document.getElementById('app');
    container.innerHTML = `
        ${renderHero()}
        <section class="max-w-7xl mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <div class="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    ${CATEGORIES.map(cat => `
                        <button onclick="setFilter('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium border transition-all ${STATE.category === cat ? 'bg-nexus-accent border-nexus-accent' : 'glass border-white/5 text-slate-400'}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                <div class="relative w-full md:w-80">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
                    <input type="text" oninput="setSearch(this.value)" placeholder="Search parts..." class="w-full glass rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-nexus-accent">
                </div>
            </div>
            <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${STATE.products.filter(p => (STATE.category === 'All' || p.category === STATE.category) && p.name.toLowerCase().includes(STATE.search.toLowerCase())).map(renderDealCard).join('')}
            </div>
        </section>
    `;
    lucide.createIcons();
};

const renderBuilder = () => {
    const container = document.getElementById('app');
    container.innerHTML = `
        <section class="max-w-4xl mx-auto px-4 py-12">
            <div class="glass rounded-3xl overflow-hidden">
                <div class="p-6 border-b border-white/5 bg-black/20 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-nexus-accent flex items-center justify-center animate-pulse">
                        <i data-lucide="bot" class="text-white"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">Nexus PC Architect</h2>
                        <p class="text-xs text-nexus-accent">Lead Generation Engine v2.0</p>
                    </div>
                </div>
                <div id="chat-box" class="h-96 overflow-y-auto p-6 space-y-4">
                    <div class="flex gap-3">
                        <div class="w-8 h-8 rounded-full bg-nexus-accent flex-shrink-0 flex items-center justify-center"><i data-lucide="cpu" class="w-4 h-4"></i></div>
                        <div class="glass p-4 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                            Greetings, Builder. Tell me your budget or target games, and I will generate the highest performance parts list currently in stock.
                        </div>
                    </div>
                </div>
                <div class="p-6 bg-black/20 border-t border-white/5">
                    <div class="relative">
                        <input id="chat-input" type="text" placeholder="e.g., Best build for 1080p Cyberpunk for ₹80k" class="w-full glass pl-4 pr-12 py-4 rounded-2xl outline-none focus:border-nexus-accent">
                        <button onclick="handleChat()" class="absolute right-2 top-2 w-10 h-10 bg-nexus-accent rounded-xl flex items-center justify-center hover:scale-105 transition-all">
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
    lucide.createIcons();
};

// --- ACTIONS ---
window.navigate = (view) => {
    STATE.view = view;
    renderHeader();
    view === 'home' ? renderHome() : renderBuilder();
};

window.setFilter = (cat) => {
    STATE.category = cat;
    renderHome();
};

window.setSearch = (val) => {
    STATE.search = val;
    renderHome();
};

window.handleChat = () => {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    if (!input.value.trim()) return;

    box.innerHTML += `
        <div class="flex flex-row-reverse gap-3">
            <div class="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center"><i data-lucide="user" class="w-4 h-4"></i></div>
            <div class="bg-nexus-accent/20 border border-nexus-accent/30 p-4 rounded-2xl rounded-tr-none text-sm text-right">${input.value}</div>
        </div>
    `;
    
    const val = input.value;
    input.value = '';
    
    setTimeout(() => {
        box.innerHTML += `
            <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-nexus-accent flex-shrink-0 flex items-center justify-center"><i data-lucide="cpu" class="w-4 h-4"></i></div>
                <div class="glass p-4 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                    Searching market for deals matching "${val}"... I recommend focusing on the <strong>RTX 4070 Super</strong> currently at ₹61,999. It's the best price-to-perf ratio right now.
                </div>
            </div>
        `;
        box.scrollTop = box.scrollHeight;
        lucide.createIcons();
    }, 1000);
    box.scrollTop = box.scrollHeight;
    lucide.createIcons();
};

// --- FOMO ENGINE ---
const runFomoEngine = () => {
    const names = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram'];
    const items = ['RTX 4070', 'Ryzen 7 7800X3D', 'OLED Monitor', 'Mechanical Keyboard'];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const name = names[Math.floor(Math.random() * names.length)];
            const item = items[Math.floor(Math.random() * items.length)];
            addToast('Verified Purchase', `${name} just snagged a ${item} deal!`, 'success');
        }
    }, 15000);
};

// --- INIT ---
const init = () => {
    STATE.products = MOCK_DEALS;
    renderHeader();
    renderHome();
    runFomoEngine();
};

init();