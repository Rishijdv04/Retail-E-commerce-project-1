import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

const initialCategories = [
  { id: 'All', label: 'Everything', detail: 'All the good stuff', emoji: '✦' },
  { id: 'Tech', label: 'Tech & gadgets', detail: 'Smart little upgrades', emoji: '🎧' },
  { id: 'Fashion', label: 'Fashion', detail: 'Wear your thing', emoji: '👟' },
  { id: 'Home', label: 'Home & living', detail: 'Make it yours', emoji: '🪴' },
  { id: 'Beauty', label: 'Beauty', detail: 'Your daily ritual', emoji: '🧴' },
  { id: 'Lifestyle', label: 'Lifestyle', detail: 'Everyday favourites', emoji: '🎒' },
];

const initialProducts = [
  {
    legacyId: 1,
    name: 'Studio Wireless Headphones',
    vendor: 'Northstar Audio',
    category: 'Tech',
    price: 2499,
    old: 3299,
    rating: 4.8,
    reviews: 124,
    status: 'Popular',
    emoji: '🎧',
    image: '/products/headphones.jpg',
    glow: '#DBEAFE',
    tag: 'BESTSELLER',
    stock: 45,
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
  },
  {
    legacyId: 2,
    name: 'Everyday Court Sneakers',
    vendor: 'Form & Field',
    category: 'Fashion',
    price: 1899,
    old: 2499,
    rating: 4.7,
    reviews: 86,
    status: 'Popular',
    emoji: '👟',
    image: '/products/sneakers.jpg',
    glow: '#E0E7FF',
    tag: '-24%',
    stock: 60,
    description: 'Crafted with premium vegan leather and ultra-cushioned shock-absorbing insoles.',
  },
  {
    legacyId: 3,
    name: 'Cloud Ceramic Mug Set',
    vendor: 'Sunday Objects',
    category: 'Home',
    price: 799,
    old: 999,
    rating: 4.9,
    reviews: 57,
    status: 'New',
    emoji: '☕',
    image: '/products/mug.jpg',
    glow: '#E0F2FE',
    tag: 'NEW IN',
    stock: 30,
    description: 'Hand-thrown artisanal ceramic mugs with a satin glaze finish.',
  },
  {
    legacyId: 4,
    name: 'Glow Daily Face Serum',
    vendor: 'Kindred Skin',
    category: 'Beauty',
    price: 649,
    old: 799,
    rating: 4.6,
    reviews: 203,
    status: 'Popular',
    emoji: '🧴',
    image: '/products/serum.jpg',
    glow: '#FCE7F3',
    tag: 'TOP RATED',
    stock: 80,
    description: 'Niacinamide + Vitamin C brightening serum for hydrated, radiant skin.',
  },
  {
    legacyId: 5,
    name: 'Minimal Everyday Backpack',
    vendor: 'Carry Culture',
    category: 'Lifestyle',
    price: 1599,
    old: 1999,
    rating: 4.7,
    reviews: 91,
    status: 'New',
    emoji: '🎒',
    image: '/products/backpack.jpg',
    glow: '#EDE9FE',
    tag: 'NEW IN',
    stock: 40,
    description: 'Water-resistant laptop daypack with ergonomic shoulder straps.',
  },
  {
    legacyId: 6,
    name: 'Smart LED Desk Lamp',
    vendor: 'Brightside Living',
    category: 'Home',
    price: 1299,
    old: 1699,
    rating: 4.5,
    reviews: 44,
    status: 'Popular',
    emoji: '💡',
    image: '/products/lamp.jpg',
    glow: '#FEF3C7',
    tag: '-23%',
    stock: 35,
    description: 'Adjustable colour temperature with touch dimmer and wireless phone charging base.',
  },
  {
    legacyId: 7,
    name: 'Pocket Bluetooth Speaker',
    vendor: 'Northstar Audio',
    category: 'Tech',
    price: 1199,
    old: 1499,
    rating: 4.6,
    reviews: 78,
    status: 'New',
    emoji: '🔊',
    image: '/products/speaker.jpg',
    glow: '#CFFAFE',
    tag: 'JUST DROPPED',
    stock: 55,
    description: 'Waterproof IPX7 outdoor speaker with punchy bass and 12-hour playtime.',
  },
  {
    legacyId: 8,
    name: 'Classic Everyday Watch',
    vendor: 'Minute & Co.',
    category: 'Fashion',
    price: 2199,
    old: 2799,
    rating: 4.8,
    reviews: 112,
    status: 'Popular',
    emoji: '⌚',
    image: '/products/watch.jpg',
    glow: '#E0E7FF',
    tag: 'FAN FAVOURITE',
    stock: 25,
    description: 'Japanese quartz movement watch with sapphire-coated crystal glass.',
  },
  {
    legacyId: 9,
    name: 'Botanical Soy Candle',
    vendor: 'Sunday Objects',
    category: 'Lifestyle',
    price: 499,
    old: 699,
    rating: 4.7,
    reviews: 66,
    status: 'New',
    emoji: '🕯️',
    image: '/products/candle.jpg',
    glow: '#F3E8FF',
    tag: 'NEW IN',
    stock: 70,
    description: '100% natural soy wax candle infused with lavender and amber essential oils.',
  },
  {
    legacyId: 10,
    name: 'Everyday Tote Bag',
    vendor: 'Form & Field',
    category: 'Fashion',
    price: 599,
    old: 799,
    rating: 4.5,
    reviews: 143,
    status: 'Popular',
    emoji: '👜',
    image: '/products/tote.jpg',
    glow: '#FCE7F3',
    tag: '-25%',
    stock: 85,
    description: 'Heavyweight organic cotton canvas tote with interior zipped pocket.',
  },
  {
    legacyId: 11,
    name: 'Hydration Steel Bottle',
    vendor: 'Good Habit Co.',
    category: 'Lifestyle',
    price: 899,
    old: 1099,
    rating: 4.6,
    reviews: 188,
    status: 'Popular',
    emoji: '🧃',
    image: '/products/bottle.jpg',
    glow: '#DBEAFE',
    tag: 'DAILY PICK',
    stock: 90,
    description: 'Double-walled vacuum insulated bottle keeps drinks cold for 24h, hot for 12h.',
  },
  {
    legacyId: 12,
    name: 'Compact Mechanical Keyboard',
    vendor: 'Keycraft Lab',
    category: 'Tech',
    price: 2999,
    old: 3599,
    rating: 4.9,
    reviews: 39,
    status: 'New',
    emoji: '⌨️',
    image: '/products/keyboard.jpg',
    glow: '#EDE9FE',
    tag: 'NEW IN',
    stock: 20,
    description: '75% layout hot-swappable tactile mechanical keyboard with RGB backlighting.',
  },
  {
    legacyId: 13,
    name: 'Everyday Glow Makeup Set, Beauty Essentials',
    vendor: 'Dot & Key',
    category: 'Beauty',
    price: 799,
    old: 1499,
    rating: 4.6,
    reviews: 428,
    status: 'Popular',
    emoji: '🍉',
    image: 'https://m.media-amazon.com/images/I/61Ls4tW2emL._AC_UL480_FMwebp_QL65_.jpg',
    glow: '#FCE7F3',
    tag: 'BEAUTY PICK',
    stock: 50,
    description: 'Watermelon cooling gel eye patches and daily glow beauty essentials for fresh, radiant skin.',
  },
];

export async function seedData() {
  try {
    // 1. Seed Admin User
    const adminEmail = 'admin@swiftcart.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log('[Seed] Creating default Platform Admin account...');
      await User.create({
        name: 'Platform Admin',
        email: adminEmail,
        password: 'Admin@12345',
        role: 'admin',
        status: 'active',
        phone: '+91 9876543210',
        addresses: [
          {
            label: 'Headquarters',
            fullName: 'SwiftCart Operations',
            phone: '+91 9876543210',
            line1: 'Tower B, Tech Innovation Park',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560100',
            isDefault: true,
          },
        ],
      });
      console.log('  → Admin created: admin@swiftcart.com / Admin@12345');
    }

    // 2. Seed Customer User
    const customerEmail = 'customer@swiftcart.com';
    const existingCustomer = await User.findOne({ email: customerEmail });
    if (!existingCustomer) {
      console.log('[Seed] Creating demo customer account...');
      await User.create({
        name: 'Rohan Sharma',
        email: customerEmail,
        password: 'Customer@123',
        role: 'customer',
        status: 'active',
        phone: '+91 9811223344',
        addresses: [
          {
            label: 'Home',
            fullName: 'Rohan Sharma',
            phone: '+91 9811223344',
            line1: 'Flat 402, Green Meadows',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            isDefault: true,
          },
        ],
      });
      console.log('  → Demo customer created: customer@swiftcart.com / Customer@123');
    }

    // 3. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('[Seed] Seeding storefront categories...');
      await Category.insertMany(initialCategories);
      console.log(`  → ${initialCategories.length} categories seeded.`);
    }

    // 4. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seed] Seeding marketplace products...');
      await Product.insertMany(initialProducts);
      console.log(`  → ${initialProducts.length} products seeded.`);
    }

    console.log('[Seed] Database initialization verified.');
  } catch (err) {
    console.error('[Seed] Error seeding data:', err.message);
  }
}

// Allow direct CLI execution: node src/seed.js
if (process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const { connectDB, disconnectDB } = await import('./config/db.js');
  await connectDB();
  await seedData();
  await disconnectDB();
  process.exit(0);
}
