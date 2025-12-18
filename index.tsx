/**
 * NEXUS DEALS - PREMIUM SALES ENGINE
 */

export {};

const STATE = {
    view: 'home',
    category: 'All',
    search: '',
    products: [] as any[],
    activities: [] as any[]
};

const AFFILIATE_CONFIG = {
    amazon: 'tag=nexusdeals-21',
    flipkart: 'affid=nexusdeals',
    newegg: 'nm_mc=AFC-Nexus'
};

const MOCK_DEALS = [
    { 
        id: '1', name: 'ZOTAC Gaming RTX 4070 Super Twin Edge', category: 'GPU', price: 61999, originalPrice: 66999, 
        retailer: 'Amazon', secondaryRetailer: 'Flipkart', secondaryPrice: 62500, rating: 4.8, 
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=RTX+4070+Super'
    },
    { 
        id: '2', name: 'AMD Ryzen 7 7800X3D 8-Core Processor', category: 'CPU', price: 36999, originalPrice: 44999, 
        retailer: 'Amazon', secondaryRetailer: 'Newegg', secondaryPrice: 38000, rating: 4.9, 
        image: 'https://images.unsplash.com/photo-1555616635-640b71bd185e?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Ryzen+7+7800X3D'
    },
    { 
        id: '3', name: 'LG 27" Ultragear OLED 240Hz Gaming Monitor', category: 'Monitor', price: 78999, originalPrice: 99999, 
        retailer: 'Amazon', secondaryRetailer: 'Flipkart', secondaryPrice: 81000, rating: 4.7, 
        image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=LG+27+OLED+240Hz'
    },
    { 
        id: '4', name: 'Samsung 990 PRO 2TB NVMe SSD', category: 'Storage', price: 16999, originalPrice: 22999, 
        retailer: 'Amazon', secondaryRetailer: 'Flipkart', secondaryPrice: 17500, rating: 4.9, 
        image: 'https://images.unsplash.com/photo-1628123018259-2c97486e033e?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Samsung+990+PRO+2TB'
    },
    { 
        id: '5', name: 'Corsair RM850e Fully Modular PSU', category: 'PSU', price: 10999, originalPrice: 12999, 
        retailer: 'Amazon', secondaryRetailer: 'Newegg', secondaryPrice: 11500, rating: 4.7, 
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Corsair+RM850e'
    },
    { 
        id: '6', name: 'Lian Li O11 Dynamic EVO Case', category: 'Case', price: 15999, originalPrice: 18999, 
        retailer: 'Flipkart', secondaryRetailer: 'Amazon', secondaryPrice: 16200, rating: 4.8, 
        image: 'https://images.unsplash.com/photo-1694464303665-27a3a8716b9d?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Lian+Li+O11+Dynamic'
    }
];

const CATEGORIES = ['All', 'GPU', 'CPU', 'Monitor', 'RAM', 'Storage', 'Case', 'PSU'];

// --- HELPERS ---
const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const getAffiliateLink = (url: string, retailer: string) => {
    const tag = (AFFILIATE_CONFIG as any)[retailer.toLowerCase()] || '';
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${tag}`;
};

const addToast = (title: string, message: string, type: string = 'info') => {
    const container = document.getElementById('toasts');
    if (!container) return;
    const id = 't-' + Date.now();
    const icons: any = { success: 'check-circle', warning: 'alert-triangle', info: 'bell' };
    
    container.insertAdjacentHTML('afterbegin', `
        <div id="${id}" class="flex items-start gap-4 p-5 rounded-2xl glass border-white/10 shadow-2xl min-w-[320px] animate-fade-in-up">
            <i data-lucide="${icons[type]}" class="w-5 h-5 ${type === 'success' ? 'text-green-400' : 'text-nexus-accent'}"></i>
            <div class="flex-1">
                <h4 class="text-sm font-bold text-white mb-1 uppercase tracking-tight">${title}</h4>
                <p class="text-xs text-slate-400 leading-relaxed">${message}</p>
            </div>
            <button onclick="this.closest('#${id}').remove()" class="text-slate-600 hover:text-white transition-colors">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `);
    if ((window as any).lucide) (window as any).lucide.createIcons();
    setTimeout(() => document.getElementById(id)?.remove(), 5000);
};

// --- RENDERERS ---
const renderHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3 cursor-pointer group" onclick="navigate('home')">
                <div class="bg-nexus-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-nexus-accent/40">
                    <i data-lucide="cpu" class="text-white w-6 h-6"></i>
                </div>
                <h1 class="font-display font-bold text-2xl text-white tracking-tighter">NEXUS<span class="text-nexus-accent">DEALS</span></h1>
            </div>
            <nav class="hidden md:flex gap-10">
                <button onclick="navigate('home')" class="text-sm font-bold tracking-widest uppercase transition-all ${STATE.view === 'home' ? 'text-nexus-accent' : 'text-slate-500 hover:text-white'}">Deals</button>
                <button onclick="navigate('builder')" class="text-sm font-bold tracking-widest uppercase transition-all ${STATE.view === 'builder' ? 'text-nexus-accent' : 'text-slate-500 hover:text-white'}">AI Architect</button>
            </nav>
            <button onclick="navigate('builder')" class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-nexus-accent/10 border border-nexus-accent/30 text-nexus-accent hover:bg-nexus-accent hover:text-white transition-all shadow-xl">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                Build Rig
            </button>
        </div>
    `;
    if ((window as any).lucide) (window as any).lucide.createIcons();
};

const renderDealCard = (p: any, i: number) => {
    const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const stock = Math.floor(Math.random() * 5) + 2;
    const stagger = `stagger-${(i % 4) + 1}`;
    
    return `
        <div class="deal-card group relative flex flex-col glass rounded-[2rem] overflow-hidden animate-fade-in-up ${stagger}">
            <div class="h-52 relative overflow-hidden bg-black/20">
                <img src="${p.image}" class="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-nexus-900 to-transparent"></div>
                <div class="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl">-${disc}% SAVED</div>
                <div class="absolute top-4 right-4 bg-nexus-900/90 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 text-nexus-accent">${p.retailer}</div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-[10px] font-black tracking-widest text-nexus-accent uppercase">${p.category}</span>
                    <div class="flex items-center gap-1 text-nexus-gold">
                        <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                        <span class="text-[10px] font-bold">${p.rating}</span>
                    </div>
                </div>
                <h3 class="font-bold text-lg text-white mb-4 line-clamp-2 leading-tight">${p.name}</h3>
                <div class="mb-6 p-3 bg-black/30 rounded-2xl border border-white/5 space-y-2">
                    <div class="flex justify-between text-[10px] font-bold">
                        <span class="text-slate-500">${p.retailer}</span>
                        <span class="text-green-400">${formatCurrency(p.price)}</span>
                    </div>
                    <div class="flex justify-between text-[10px] font-bold opacity-40">
                        <span class="text-slate-500">${p.secondaryRetailer}</span>
                        <span class="text-slate-300">${formatCurrency(p.secondaryPrice)}</span>
                    </div>
                </div>
                <div class="mt-auto">
                    <div class="flex items-end justify-between mb-5">
                        <div>
                            <p class="text-[10px] text-slate-500 line-through mb-1">${formatCurrency(p.originalPrice)}</p>
                            <p class="text-3xl font-display font-black text-white">${formatCurrency(p.price)}</p>
                        </div>
                        <p class="text-[10px] font-bold text-red-400 flex items-center gap-1 animate-pulse">
                            <i data-lucide="alert-circle" class="w-3 h-3"></i> Only ${stock} left
                        </p>
                    </div>
                    <a href="${getAffiliateLink(p.url, p.retailer)}" target="_blank" class="block w-full text-center py-4 bg-nexus-accent text-white font-black text-xs rounded-2xl transition-all hover:scale-[1.03] shadow-lg shadow-nexus-accent/30 uppercase tracking-widest overflow-hidden relative group/btn">
                        <span class="relative z-10">Check Price</span>
                        <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                    </a>
                </div>
            </div>
        </div>
    `;
};

const renderHome = () => {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <section class="relative py-32 overflow-hidden text-center">
            <div class="scanner-line"></div>
            <div class="max-w-7xl mx-auto px-4 relative z-10">
                <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-nexus-accent/20 text-nexus-accent text-[11px] font-black tracking-widest mb-10 uppercase animate-glow">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    Live Scanner: 14,202 SKUs Detected
                </div>
                <h1 class="text-6xl md:text-8xl font-display font-black text-white mb-10 tracking-tighter leading-tight animate-fade-in-up">
                    PRO HARDWARE.<br><span class="text-nexus-accent">SMART SAVINGS.</span>
                </h1>
                <p class="max-w-xl mx-auto text-slate-400 mb-14 text-xl leading-relaxed">AI-driven price monitoring across Amazon & Flipkart. Build your dream rig for less.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-6">
                    <button onclick="navigate('builder')" class="px-12 py-5 bg-nexus-accent text-white rounded-2xl font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-nexus-accent/40">Launch Architect</button>
                    <button class="px-12 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest border border-white/10">Hot Deals</button>
                </div>
            </div>
        </section>
        <section class="max-w-7xl mx-auto px-4 py-20">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
                <div class="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                    ${CATEGORIES.map(cat => `
                        <button onclick="setFilter('${cat}')" class="px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${STATE.category === cat ? 'bg-nexus-accent border-nexus-accent text-white shadow-xl' : 'glass border-white/5 text-slate-500 hover:text-white'}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                <div class="relative w-full md:w-96">
                    <i data-lucide="search" class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"></i>
                    <input type="text" id="search-input" placeholder="Search RTX 4090, i9..." class="w-full bg-nexus-800/50 border border-white/5 rounded-[1.5rem] pl-14 pr-7 py-5 outline-none focus:border-nexus-accent transition-all text-sm">
                </div>
            </div>
            <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                ${STATE.products.filter(p => (STATE.category === 'All' || p.category === STATE.category) && p.name.toLowerCase().includes(STATE.search.toLowerCase())).map((p, i) => renderDealCard(p, i)).join('')}
            </div>
        </section>
    `;
    document.getElementById('search-input')?.addEventListener('input', (e) => setSearch((e.target as HTMLInputElement).value));
    if ((window as any).lucide) (window as any).lucide.createIcons();
};

const renderBuilder = () => {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <section class="max-w-4xl mx-auto px-4 py-24">
            <div class="glass rounded-[3rem] overflow-hidden border-nexus-accent/30 shadow-2xl animate-fade-in-up">
                <div class="p-10 border-b border-white/5 bg-black/40 flex items-center gap-8">
                    <div class="w-20 h-20 rounded-3xl bg-nexus-accent flex items-center justify-center animate-glow">
                        <i data-lucide="bot" class="text-white w-10 h-10 animate-float"></i>
                    </div>
                    <div>
                        <h2 class="text-3xl font-display font-black tracking-tight text-white">NEXUS ARCHITECT</h2>
                        <p class="text-xs text-nexus-accent font-black tracking-[0.3em] uppercase opacity-70">Intelligence Engine v3.0</p>
                    </div>
                </div>
                <div id="chat-box" class="h-[500px] overflow-y-auto p-10 space-y-8 bg-nexus-900/50 no-scrollbar">
                    <div class="flex gap-5">
                        <div class="w-10 h-10 rounded-xl bg-nexus-accent flex-shrink-0 flex items-center justify-center shadow-lg"><i data-lucide="zap" class="w-5 h-5 text-white"></i></div>
                        <div class="glass p-6 rounded-[2rem] rounded-tl-none text-sm max-w-[85%] leading-relaxed text-slate-200">
                            Builder detected. I have scanned <span class="text-nexus-accent font-bold">14,202 SKUs</span> in the last 60 seconds. <br><br>Describe your target resolution (1080p, 4K) or budget. I will find the price-errors first.
                        </div>
                    </div>
                </div>
                <div class="p-10 bg-black/40 border-t border-white/5">
                    <div class="relative">
                        <input id="chat-input" type="text" placeholder="I need a 4K rig for ₹2 Lakh..." class="w-full bg-nexus-800/80 border border-white/10 pl-6 pr-16 py-6 rounded-3xl outline-none focus:border-nexus-accent text-lg font-medium transition-all">
                        <button onclick="handleChat()" class="absolute right-3 top-3 w-14 h-14 bg-nexus-accent rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                            <i data-lucide="send" class="w-6 h-6 text-white"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
    if ((window as any).lucide) (window as any).lucide.createIcons();
};

// --- ACTIONS ---
const navigate = (view: string) => {
    STATE.view = view;
    renderHeader();
    view === 'home' ? renderHome() : renderBuilder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const setFilter = (cat: string) => {
    STATE.category = cat;
    renderHome();
};

const setSearch = (val: string) => {
    STATE.search = val;
    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.innerHTML = STATE.products
            .filter(p => (STATE.category === 'All' || p.category === STATE.category) && p.name.toLowerCase().includes(STATE.search.toLowerCase()))
            .map((p, i) => renderDealCard(p, i))
            .join('');
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }
};

const handleChat = () => {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const box = document.getElementById('chat-box');
    if (!input || !box || !input.value.trim()) return;
    const val = input.value;
    input.value = '';
    box.insertAdjacentHTML('beforeend', `
        <div class="flex flex-row-reverse gap-5">
            <div class="w-10 h-10 rounded-xl bg-slate-600 flex-shrink-0 flex items-center justify-center shadow-lg"><i data-lucide="user" class="w-5 h-5 text-white"></i></div>
            <div class="bg-nexus-accent/20 border border-nexus-accent/40 p-6 rounded-[2rem] rounded-tr-none text-sm text-right text-slate-100">${val}</div>
        </div>
    `);
    box.scrollTop = box.scrollHeight;
    setTimeout(() => {
        box.insertAdjacentHTML('beforeend', `
            <div class="flex gap-5 animate-fade-in-up">
                <div class="w-10 h-10 rounded-xl bg-nexus-accent flex-shrink-0 flex items-center justify-center shadow-lg"><i data-lucide="zap" class="w-5 h-5 text-white"></i></div>
                <div class="glass p-6 rounded-[2rem] rounded-tl-none text-sm max-w-[85%] leading-relaxed text-slate-200">
                    Scanning market... I've located a <span class="text-green-400 font-bold">12% discount</span> on the 4070 Super at Amazon India. Ready for the part-list?
                </div>
            </div>
        `);
        box.scrollTop = box.scrollHeight;
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }, 1000);
};

// --- INIT ---
(window as any).navigate = navigate;
(window as any).setFilter = setFilter;
(window as any).setSearch = setSearch;
(window as any).handleChat = handleChat;

const init = () => {
    STATE.products = MOCK_DEALS;
    renderHeader();
    renderHome();
    
    // Social proof engine
    const names = ['Rahul', 'Sneha', 'Vikram', 'Ananya'];
    const hardware = ['RTX 4070', 'Ryzen 7', 'OLED Monitor'];
    setInterval(() => {
        if (Math.random() > 0.6) {
            const n = names[Math.floor(Math.random()*names.length)];
            const h = hardware[Math.floor(Math.random()*hardware.length)];
            addToast('Verified Order', `${n} from Mumbai just saved ₹5,200 on a ${h}!`, 'success');
        }
    }, 12000);
};

init();