const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@min-ecomm.com',
    password: 'admin123',
    role: 'admin',
    address: {
      street: '123 Admin Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    address: {
      street: '456 User Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    address: {
      street: '789 Customer Road',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  }
];

const products = [
  {
    name: 'Samsung Galaxy S23 Ultra',
    category: 'Electronics',
    price: 89999,
    description: 'Samsung Galaxy S23 Ultra 5G with 12GB RAM, 256GB Storage, 200MP Camera, 5000mAh Battery, Snapdragon 8 Gen 2 Processor',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    stock: 25
  },
  {
    name: 'Apple iPhone 15 Pro',
    category: 'Electronics',
    price: 134900,
    description: 'Apple iPhone 15 Pro with A17 Pro chip, 256GB storage, Pro camera system with 48MP main camera, Titanium design',
    image: 'https://images.unsplash.com/photo-1592286927505-4f86229312c0?w=500&h=500&fit=crop',
    stock: 18
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics',
    price: 29990,
    description: 'Industry-leading noise canceling wireless headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30-hour battery life',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    stock: 40
  },
  {
    name: 'Dell XPS 15 Laptop',
    category: 'Electronics',
    price: 159990,
    description: 'Dell XPS 15 with 13th Gen Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 4050, 15.6" FHD+ Display',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    stock: 12
  },
  {
    name: 'Apple MacBook Air M2',
    category: 'Electronics',
    price: 114900,
    description: 'MacBook Air 13" with M2 chip, 8GB RAM, 256GB SSD, Liquid Retina Display, fanless design',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    stock: 20
  },
  {
    name: 'Nike Air Max 270',
    category: 'Sports',
    price: 12995,
    description: "Nike's biggest heel Air unit yet delivers a super-soft ride that feels as impossible as it looks. Running-inspired design with breathable mesh upper",
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    stock: 50
  },
  {
    name: 'Adidas Ultraboost 22',
    category: 'Sports',
    price: 16999,
    description: 'Ultraboost 22 running shoes with responsive cushioning, Primeknit upper, Continental rubber outsole for superior grip',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    stock: 35
  },
  {
    name: "Levi's 501 Original Jeans",
    category: 'Clothing',
    price: 3999,
    description: "The original blue jean since 1873. A blank canvas for self-expression, the 501 Original Fit is a cultural icon",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    stock: 100
  },
  {
    name: 'Roadster Cotton T-Shirt',
    category: 'Clothing',
    price: 499,
    description: 'Pure cotton round neck t-shirt, comfortable fit, available in multiple colors, perfect for casual wear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    stock: 150
  },
  {
    name: 'Allen Solly Formal Shirt',
    category: 'Clothing',
    price: 1599,
    description: 'Slim fit formal shirt, premium cotton blend, perfect for office wear, wrinkle-free fabric',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop',
    stock: 80
  },
  {
    name: 'The Alchemist by Paulo Coelho',
    category: 'Books',
    price: 299,
    description: 'A magical fable about following your dream, this international bestseller has inspired millions to transform their lives',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
    stock: 200
  },
  {
    name: 'Atomic Habits by James Clear',
    category: 'Books',
    price: 499,
    description: 'Transform your life with tiny changes in behavior. A proven framework for getting better every day',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop',
    stock: 180
  },
  {
    name: 'Rich Dad Poor Dad by Robert Kiyosaki',
    category: 'Books',
    price: 350,
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&h=500&fit=crop',
    stock: 160
  },
  {
    name: 'Pigeon Pressure Cooker 5L',
    category: 'Home & Kitchen',
    price: 1899,
    description: 'Aluminum inner lid pressure cooker with induction base, 5 liter capacity, comes with safety features',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    stock: 45
  },
  {
    name: 'Prestige Induction Cooktop',
    category: 'Home & Kitchen',
    price: 2499,
    description: '2000W induction cooktop with automatic voltage regulator, feather touch buttons, Indian menu options',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop',
    stock: 30
  },
  {
    name: 'Milton Thermosteel Flask 1L',
    category: 'Home & Kitchen',
    price: 899,
    description: 'Vacuum insulated steel flask, keeps beverages hot for 24 hours and cold for 24 hours, leak-proof',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 70
  },
  {
    name: 'Yonex Badminton Racket',
    category: 'Sports',
    price: 3499,
    description: 'Professional badminton racket with isometric head shape, lightweight carbon fiber frame, strung with high-quality strings',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=500&fit=crop',
    stock: 28
  },
  {
    name: 'Nivia Football Size 5',
    category: 'Sports',
    price: 799,
    description: 'FIFA approved size 5 football, PVC construction, suitable for professional matches and practice',
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&h=500&fit=crop',
    stock: 60
  },
  {
    name: 'LEGO City Fire Station',
    category: 'Toys',
    price: 4999,
    description: '509-piece LEGO set featuring fire station with garage, fire truck, helicopter, and 4 minifigures',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop',
    stock: 22
  },
  {
    name: 'Hot Wheels 50 Car Gift Pack',
    category: 'Toys',
    price: 2999,
    description: 'Set of 50 die-cast toy cars in 1:64 scale, featuring a variety of vehicles from the Hot Wheels collection',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    stock: 35
  },
  {
    name: 'Funskool Monopoly Board Game',
    category: 'Toys',
    price: 1299,
    description: 'Classic property trading board game for 2-8 players, includes game board, money, property cards, and tokens',
    image: 'https://images.unsplash.com/photo-1566694271355-9ead56467fd3?w=500&h=500&fit=crop',
    stock: 42
  },
  {
    name: 'boAt Airdopes 131',
    category: 'Electronics',
    price: 1299,
    description: 'True wireless earbuds with 12 hours playback, IPX4 water resistance, Bluetooth v5.0, IWP technology',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    stock: 90
  },
  {
    name: 'Realme Smart Watch',
    category: 'Electronics',
    price: 3999,
    description: '1.4" touchscreen display, 24/7 heart rate monitoring, SpO2 measurement, 15 sports modes, 9-day battery life',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    stock: 48
  },
  {
    name: 'HP DeskJet Printer',
    category: 'Electronics',
    price: 4799,
    description: 'All-in-one wireless printer with scan, copy, print functions, thermal inkjet technology, mobile printing support',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop',
    stock: 15
  },
  {
    name: 'Van Heusen Formal Trousers',
    category: 'Clothing',
    price: 1999,
    description: 'Flat-front formal trousers, poly-viscose blend, slim fit, wrinkle-resistant fabric, perfect for office',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop',
    stock: 55
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Existing data cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('\n✅ Seed data inserted successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👑 ADMIN:');
    console.log('   Email: admin@min-ecomm.com');
    console.log('   Password: admin123');
    console.log('\n👤 USER 1:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('\n👤 USER 2:');
    console.log('   Email: jane@example.com');
    console.log('   Password: password123');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
