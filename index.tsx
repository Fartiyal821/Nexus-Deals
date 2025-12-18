/**
 * NEXUS DEALS - PREMIUM SALES ENGINE
 * Optimized for $2000+/mo Affiliate Revenue
 */

export {};

// --- STATE ---
const STATE = {
    view: 'home',
    category: 'All',
    search: '',
    products: [] as any[],
    loading: false
};

// --- ENHANCED PRODUCT DATA ---
const MOCK_DEALS = [
    { 
        id: '1', 
        name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super', 
        category: 'GPU', 
        price: 84999, 
        originalPrice: 92999, 
        retailer: 'Amazon',
        secondaryRetailer: 'Flipkart',
        secondaryPrice: 86500,
        rating: 4.9, 
        reviews: 840, 
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=RTX+4070+Ti+Super'
    },
    { 
        id: '2', 
        name: 'AMD Ryzen 9 7950X3D 16-Core Processor', 
        category: 'CPU', 
        price: 52999, 
        originalPrice: 64999, 
        retailer: 'Newegg',
        secondaryRetailer: 'Amazon',
        secondaryPrice: 54000,
        rating: 4.8, 
        reviews: 1250, 
        image: 'https://images.unsplash.com/photo-1555616635-640b71bd185e?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Ryzen+9+7950X3D'
    },
    { 
        id: '3', 
        name: 'Samsung Odyssey Neo G9 49" Curved OLED', 
        category: 'Monitor', 
        price: 125999, 
        originalPrice: 159999, 
        retailer: 'Amazon',
        secondaryRetailer: 'Flipkart',
        secondaryPrice: 129000,
        rating: 4.7, 
        reviews: 430, 
        image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Samsung+Odyssey+Neo+G9'
    },
    { 
        id: '4', 
        name: 'Corsair Dominator Titanium 64GB DDR5 6600MHz', 
        category: 'RAM', 
        price: 24999, 
        originalPrice: 29999, 
        retailer: 'Amazon',
        secondaryRetailer: 'Newegg',
        secondaryPrice: 26000,
        rating: 4.9, 
        reviews: 210, 
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Corsair+Dominator+Titanium+DDR5'
    },
    { 
        id: '5', 
        name: 'Lian Li PC-O11 Dynamic EVO RGB Case', 
        category: 'Case', 
        price: 16499, 
        originalPrice: 19999, 
        retailer: 'Flipkart',
        secondaryRetailer: 'Amazon',
        secondaryPrice: 17200,
        rating: 4.8, 
        reviews: 940, 
        image: 'https://images.unsplash.com/photo-1694464303665-27a3a8716b9d?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Lian+Li+O11+Dynamic'
    },
    { 
        id: '6', 
        name: 'Samsung 990 PRO 4TB NVMe with Heatsink', 
        category: 'Storage', 
        price: 29999, 
        originalPrice: 38999, 
        retailer: 'Amazon',
        secondaryRetailer: 'Newegg',
        secondaryPrice: 31000,
        rating: 5.0, 
        reviews: 15400, 
        image: 'https://images.unsplash.com/photo-1628123018259-2c97486e033e?auto=format&fit=crop&q=80&w=800',
        url: 'https://www.amazon.in/s?k=Samsung+990+PRO+4TB'
    }
];

const CATEGORIES = ['All', 'GPU', 'CPU', 'Monitor', 'RAM', 'Storage', 'Case', 'PSU'];

// --- UTILITIES ---
const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const generateAffiliateLink = (url: string, retailer: string) => {
    const tags: Record<string, string> = {
        'Amazon': 'tag=nexuspc-21',
        'Flipkart': 'affid=nexuspc',
        'Newegg': 'nm_mc=AFC-Nexus'
    };
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${tags[retailer] || ''}`;
};

// --- RENDER COMPONENTS ---
const renderHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2 cursor-pointer group" onclick="navigate('home')">
                <div class="bg-nexus-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-nexus-accent/40 animate-float">
                    <i data-lucide="cpu" class="text-white"></i>
                </div>
                <h1 class="font-display font-bold text-2xl text-white tracking-tighter">NEXUS<span class="text-nexus-accent">DEALS</span></h1>
            </div>
            <nav class="hidden md:flex gap-10">
                <button onclick="navigate('home')" class="text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group">
                    <span class="${STATE.view === 'home' ? 'text-nexus-accent' : 'text-slate-500 hover:text-white'}">Deals</span>
                    <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-nexus-accent transition-transform duration-300 ${STATE.view === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
                </button>
                <button class="text-sm font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-all">Price History</button>
            </nav>
            <div class="flex items-center gap-4">
                <button onclick="navigate('builder')" class="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold glass border-nexus-accent/30 text-nexus-accent hover:bg-nexus-accent hover:text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    AI Architect
                </button>
            </div>
        </div>
    `;
    if ((window as any).lucide) (window as any).lucide.createIcons();
};

const renderDealCard = (product: any, index: number) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const affiliateUrl = generateAffiliateLink(product.url, product.retailer);
    const secondaryUrl = generateAffiliateLink(product.url, product.secondaryRetailer);
    const stock = Math.floor(Math.random() * 5) + 2;
    const staggerClass = `stagger-${(index % 4) + 1}`;

    return `
        <div class="deal-card group relative flex flex-col bg-nexus-800/40 border border-white/5 rounded-3xl overflow-hidden animate-fade-in-up ${staggerClass}">
            <!-- Image Section -->
            <div class="h-56 relative overflow-hidden bg-black/20">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    loading="lazy"
                    class="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-nexus-900 via-transparent to-transparent"></div>
                
                <!-- Floating Badges -->
                <div class="absolute top-4 left-4 flex flex-col gap-2">
                    <div class="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl flex items-center gap-1 animate-pulse-fast">
                        <i data-lucide="trending-down" class="w-3 h-3"></i> ${discount}% SAVED
                    </div>
                </div>
                
                <div class="absolute top-4 right-4 bg-nexus-900/90 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 text-nexus-accent shadow-2xl">
                    ${product.retailer}
                </div>
            </div>

            <!-- Content Section -->
            <div class="p-6 flex-1 flex flex-col relative z-10">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-[10px] font-black tracking-[0.2em] text-nexus-accent uppercase">${product.category}</span>
                    <div class="flex items-center gap-1 text-nexus-gold">
                        <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                        <span class="text-[10px] font-bold">${product.rating}</span>
                    </div>
                </div>

                <h3 class="font-bold text-lg text-white mb-4 line-clamp-2 leading-tight group-hover:text-nexus-accent transition-colors">${product.name}</h3>
                
                <!-- Multi-Retailer Comparison Table -->
                <div class="space-y-2 mb-6 p-3 bg-black/30 rounded-2xl border border-white/5 group-hover:border-nexus-accent/20 transition-all duration-300">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-500">${product.retailer}</span>
                        <span class="text-xs font-bold text-green-400 animate-pulse">${formatCurrency(product.price)}</span>
                    </div>
                    <div class="flex justify-between items-center opacity-60">
                        <span class="text-[10px] font-bold text-slate-500">${product.secondaryRetailer}</span>
                        <span class="text-xs font-bold text-slate-300">${formatCurrency(product.secondaryPrice)}</span>
                    </div>
                </div>

                <div class="mt-auto">
                    <div class="flex items-end justify-between mb-5">
                        <div>
                            <p class="text-[10px] text-slate-500 line-through mb-1">${formatCurrency(product.originalPrice)}</p>
                            <p class="text-3xl font-display font-black text-white group-hover:scale-105 origin-left transition-transform">${formatCurrency(product.price)}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[10px] font-bold text-red-400 flex items-center gap-1">
                                <i data-lucide="alert-circle" class="w-3 h-3 animate-bounce"></i> Only ${stock} left
                             </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <a href="${affiliateUrl}" target="_blank" class="flex items-center justify-center gap-2 py-3.5 bg-nexus-accent hover:bg-nexus-accent/80 text-white font-black text-[11px] rounded-2xl transition-all shadow-lg hover:shadow-nexus-accent/40 active:scale-95 uppercase tracking-widest overflow-hidden relative group/btn">
                            <span class="relative z-10">Buy Now</span>
                            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                        </a>
                        <a href="${secondaryUrl}" target="_blank" class="flex items-center justify-center gap-2 py-3.5 glass hover:bg-white/10 text-white font-bold text-[11px] rounded-2xl transition-all active:scale-95 uppercase tracking-widest border border-white/10">
                            Compare
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderHome = () => {
    const container = document.getElementById('app');
    if (!container) return;
    
    container.innerHTML = `
        <section class="relative py-32 overflow-hidden">
            <div class="absolute inset-0 bg-nexus-900/50 z-0"></div>
            <div class="scan-line"></div>
            <div class="max-w-7xl mx-auto px-4 relative z-10 text-center animate-fade-in-up">
                <div class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-nexus-accent/20 text-nexus-accent text-[11px] font-black tracking-widest mb-10 uppercase animate-glow">
                    <span class="flex h-2 w-2 relative">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Market Scanner: ${STATE.products.length} Drops Detected
                </div>
                <h1 class="text-6xl md:text-8xl font-display font-black text-white mb-10 tracking-tighter leading-[0.85]">
                    PRO HARDWARE.<br><span class="text-nexus-accent drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">SMART SAVINGS.</span>
                </h1>
                <p class="max-w-2xl mx-auto text-slate-400 mb-14 text-xl leading-relaxed font-light">
                    AI-driven price monitoring across <span class="text-white font-semibold">Amazon</span>, <span class="text-white font-semibold">Flipkart</span>, and <span class="text-white font-semibold">Newegg</span>. Don't build until we scan.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-6">
                    <button onclick="navigate('builder')" class="px-10 py-5 bg-nexus-accent text-white rounded-2xl font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-nexus-accent/40">Launch Architect</button>
                    <button class="px-10 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all border border-white/10">Explore Deals</button>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 py-20">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-20 animate-fade-in-up stagger-2">
                <div class="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
                    ${CATEGORIES.map(cat => `
                        <button onclick="setFilter('${cat}')" class="px-7 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${STATE.category === cat ? 'bg-nexus-accent border-nexus-accent text-white shadow-xl shadow-nexus-accent/30 scale-110' : 'glass border-white/5 text-slate-500 hover:text-white hover:border-white/20'}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                <div class="relative w-full md:w-96 group">
                    <i data-lucide="search" class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-nexus-accent transition-colors"></i>
                    <input type="text" id="search-input" placeholder="Search 4090, i9, DDR5..." class="w-full bg-nexus-800/50 border border-white/5 rounded-3xl pl-14 pr-7 py-5 outline-none focus:border-nexus-accent transition-all text-sm font-medium focus:bg-nexus-800 shadow-inner">
                </div>
            </div>

            <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                ${STATE.products.filter(p => (STATE.category === 'All' || p.category === STATE.category) && p.name.toLowerCase().includes(STATE.search.toLowerCase())).map((p, i) => renderDealCard(p, i)).join('')}
            </div>
        </section>
    `;
    
    document.getElementById('search-input')?.addEventListener('input', (e) => (window as any).setSearch((e.target as HTMLInputElement).value));
    if ((window as any).lucide) (window as any).lucide.createIcons();
};

const renderBuilder = () => {
    const container = document.getElementById('app');
    if (!container) return;
    
    container.innerHTML = `
        <section class="max-w-4xl mx-auto px-4 py-24">
            <div class="glass rounded-[48px] overflow-hidden border-nexus-accent/30 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] animate-fade-in-up">
                <div class="p-12 border-b border-white/5 bg-black/40 flex items-center gap-10">
                    <div class="w-24 h-24 rounded-[32px] bg-nexus-accent flex items-center justify-center animate-glow shadow-2xl">
                        <i data-lucide="bot" class="text-white w-12 h-12 animate-float"></i>
                    </div>
                    <div>
                        <h2 class="text-4xl font-display font-black tracking-tight text-white mb-1">NEXUS ARCHITECT</h2>
                        <p class="text-xs text-nexus-accent font-black tracking-[0.4em] uppercase opacity-70">Inventory Intelligence Engine v3.0</p>
                    </div>
                </div>
                <div id="chat-box" class="h-[550px] overflow-y-auto p-12 space-y-10 bg-nexus-900/50 no-scrollbar">
                    <div class="flex gap-6 animate-slide-in-right">
                        <div class="w-12 h-12 rounded-2xl bg-nexus-accent flex-shrink-0 flex items-center justify-center shadow-xl"><i data-lucide="zap" class="w-6 h-6"></i></div>
                        <div class="glass p-7 rounded-[32px] rounded-tl-none text-base max-w-[85%] leading-relaxed text-slate-200 shadow-2xl border-white/10">
                            Greetings, Builder. I have analyzed <span class="text-nexus-accent font-black">18,542 active deals</span> in the last 15 seconds. <br><br>Tell me your goal: Competitive Gaming, 4K Productivity, or a specific budget limit? I will calculate the absolute peak performance for every rupee.
                        </div>
                    </div>
                </div>
                <div class="p-10 bg-black/40 border-t border-white/5">
                    <div class="relative group">
                        <input id="chat-input" type="text" placeholder="I need a 1440p gaming beast for ₹1.2 Lakh..." class="w-full bg-nexus-800/80 border border-white/10 pl-8 pr-20 py-7 rounded-[32px] outline-none focus:border-nexus-accent text-lg font-medium transition-all shadow-inner focus:bg-nexus-800">
                        <button id="chat-send" class="absolute right-4 top-4 w-14 h-14 bg-nexus-accent rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl hover:shadow-nexus-accent/50 group-hover:rotate-6">
                            <i data-lucide="send" class="w-7 h-7"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    document.getElementById('chat-send')?.addEventListener('click', () => (window as any).handleChat());
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => e.key === 'Enter' && (window as any).handleChat());
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
    
    box.innerHTML += `
        <div class="flex flex-row-reverse gap-6 animate-slide-in-right">
            <div class="w-12 h-12 rounded-2xl bg-slate-600 flex-shrink-0 flex items-center justify-center shadow-xl"><i data-lucide="user" class="w-6 h-6"></i></div>
            <div class="bg-nexus-accent/20 border border-nexus-accent/40 p-7 rounded-[32px] rounded-tr-none text-base text-right leading-relaxed text-slate-100 shadow-2xl">${val}</div>
        </div>
    `;
    
    box.scrollTop = box.scrollHeight;
    
    setTimeout(() => {
        const response = `Scanning inventory for "${val}"... I've detected a <span class="text-green-400 font-black">significant price error</span> on the 7950X3D at Amazon India. When combined with the current O11 Dynamic deal on Flipkart, we can build your target rig for ₹14,200 <span class="text-white font-black underline">less</span> than last week's market average. Ready for the part-list?`;
        box.innerHTML += `
            <div class="flex gap-6 animate-slide-in-right">
                <div class="w-12 h-12 rounded-2xl bg-nexus-accent flex-shrink-0 flex items-center justify-center shadow-xl"><i data-lucide="zap" class="w-6 h-6"></i></div>
                <div class="glass p-7 rounded-[32px] rounded-tl-none text-base max-w-[85%] leading-relaxed text-slate-200 shadow-2xl border-white/10">
                    ${response}
                </div>
            </div>
        `;
        box.scrollTop = box.scrollHeight;
        if ((window as any).lucide) (window as any).lucide.createIcons();
    }, 1200);
};

// --- INITIALIZATION ---
(window as any).navigate = navigate;
(window as any).setFilter = setFilter;
(window as any).setSearch = setSearch;
(window as any).handleChat = handleChat;

const init = () => {
    STATE.products = MOCK_DEALS;
    renderHeader();
    renderHome();
};

init();
