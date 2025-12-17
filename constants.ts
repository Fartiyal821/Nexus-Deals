import { Product } from './types';

// Helper to set a future time for countdowns
const hoursFromNow = (h: number) => Date.now() + h * 60 * 60 * 1000;

export const MOCK_DEALS: Product[] = [
  {
    id: '1',
    name: 'ZOTAC Gaming GeForce RTX 4070 Super Twin Edge OC',
    category: 'GPU',
    price: 61999,
    originalPrice: 66999,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.7,
    reviews: 156,
    url: 'https://www.amazon.in/dp/B0CSK2F6QW',
    features: ['12GB GDDR6X', 'DLSS 3.5 Frame Gen', 'Compact Design'],
    dealEndsIn: hoursFromNow(5),
    lastChecked: Date.now()
  },
  {
    id: '2',
    name: 'AMD Ryzen 7 7800X3D 8-Core, 16-Thread Desktop Processor',
    category: 'CPU',
    price: 36999,
    originalPrice: 44999,
    image: 'https://images.unsplash.com/photo-1555616635-640b71bd185e?auto=format&fit=crop&q=80&w=800',
    retailer: 'Newegg', // Newegg ships to India or simulates similar retailers like MDComputers
    rating: 4.9,
    reviews: 3240,
    url: 'https://www.newegg.com/global/in-en/amd-ryzen-7-7800x3d-ryzen-7-7000-series/p/N82E16819113793',
    features: ['Best Gaming CPU', '3D V-Cache', 'AM5 Platform'],
    dealEndsIn: hoursFromNow(10),
    lastChecked: Date.now()
  },
  {
    id: '3',
    name: 'LG 27" Ultragear™ OLED QHD 240Hz Gaming Monitor',
    category: 'Monitor',
    price: 78999,
    originalPrice: 99999,
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.6,
    reviews: 580,
    url: 'https://www.amazon.in/LG-Ultragear-Monitor-Response-Display/dp/B0C2CFJ913',
    features: ['OLED Panel', '0.03ms GtG', 'HDR10'],
    dealEndsIn: hoursFromNow(3),
    lastChecked: Date.now()
  },
  {
    id: '4',
    name: 'G.SKILL Trident Z5 Neo RGB Series 32GB (2 x 16GB)',
    category: 'RAM',
    price: 11499,
    originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
    retailer: 'Newegg',
    rating: 4.8,
    reviews: 920,
    url: 'https://www.newegg.com/global/in-en/g-skill-32gb-ddr5-6000/p/N82E16820232920',
    features: ['DDR5 6000', 'CL30 Timing', 'AMD EXPO Ready'],
    lastChecked: Date.now()
  },
  {
    id: '5',
    name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD',
    category: 'Storage',
    price: 16999,
    originalPrice: 22999,
    image: 'https://images.unsplash.com/photo-1628123018259-2c97486e033e?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.9,
    reviews: 8600,
    url: 'https://www.amazon.in/SAMSUNG-Internal-Expansion-MZ-V9P2T0B-AM/dp/B0BHJJ9Y77',
    features: ['7450 MB/s Read', 'Reliable Thermal Control', 'PS5 Compatible'],
    lastChecked: Date.now()
  },
  {
    id: '6',
    name: 'Lian Li O11 Vision Chrome Mid Tower Case',
    category: 'Case',
    price: 13999,
    originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1694464303665-27a3a8716b9d?auto=format&fit=crop&q=80&w=800',
    retailer: 'Flipkart',
    rating: 4.8,
    reviews: 450,
    url: 'https://www.flipkart.com/lian-li-o11-dynamic',
    features: ['3-Side Tempered Glass', 'Hidden Pillars', 'E-ATX Support'],
    dealEndsIn: hoursFromNow(24),
    lastChecked: Date.now()
  },
  {
    id: '7',
    name: 'Logitech G Pro X Superlight 2 Wireless Mouse',
    category: 'Mouse',
    price: 12995,
    originalPrice: 14995,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.7,
    reviews: 1230,
    url: 'https://www.amazon.in/Logitech-Superlight-Wireless-Gaming-Mouse/dp/B0BMQ86T6G',
    features: ['60g Ultra-light', '2kHz Polling', 'USB-C Charging'],
    lastChecked: Date.now()
  },
  {
    id: '8',
    name: 'Corsair RM850e (2023) Fully Modular Low-Noise ATX Power Supply',
    category: 'PSU',
    price: 10999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.7,
    reviews: 2100,
    url: 'https://www.amazon.in/Corsair-RM850e-Modular-Low-Noise-Supply/dp/B0BYQPH5J3',
    features: ['80+ Gold Certified', 'ATX 3.0', 'Silent Fan'],
    dealEndsIn: hoursFromNow(16),
    lastChecked: Date.now()
  },
  {
    id: '9',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Keyboard',
    price: 17999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    retailer: 'Amazon',
    rating: 4.6,
    reviews: 320,
    url: 'https://www.keychron.in/products/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard',
    features: ['Aluminum Body', 'QMK/VIA Support', 'Bluetooth 5.1'],
    lastChecked: Date.now()
  }
];

export const CATEGORIES = ['All', 'GPU', 'CPU', 'Monitor', 'RAM', 'Storage', 'Case', 'PSU', 'Mouse', 'Keyboard'];