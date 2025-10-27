const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mini-ecommerce')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const Product = require('./models/Product');

// Diverse image pools for different product types
const imagesByType = {
  // Electronics
  'Smartphone': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'https://images.unsplash.com/photo-1592286968598-0365d3c7e42f?w=400',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'
  ],
  'Laptop': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400'
  ],
  'Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'
  ],
  'Earbuds': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    'https://images.unsplash.com/photo-1598331668826-20cecc09c68c?w=400'
  ],
  'Smartwatch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400'
  ],
  'Tablet': [
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    'https://images.unsplash.com/photo-1585789575347-f751fb2e4f7b?w=400',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
  ],
  'Speaker': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    'https://images.unsplash.com/photo-1558584673-c834fb1cc1c7?w=400',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'
  ],
  'Mouse': [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400'
  ],
  'Keyboard': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400'
  ],
  'Power Bank': [
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    'https://images.unsplash.com/photo-1625245488600-f27c8d5b5d5f?w=400'
  ],
  'Charger': [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400'
  ],

  // Clothing
  'T-Shirt': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400'
  ],
  'Shirt': [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400'
  ],
  'Jeans': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400'
  ],
  'Jacket': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'
  ],
  'Hoodie': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400'
  ],
  'Dress': [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400',
    'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400'
  ],
  'Trousers': [
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'
  ],
  'Kurta': [
    'https://images.unsplash.com/photo-1610652492500-ded49492fe66?w=400',
    'https://images.unsplash.com/photo-1583391733981-5f5fd7b3a3d3?w=400'
  ],
  'Saree': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400'
  ],
  'Ethnic Wear': [
    'https://images.unsplash.com/photo-1610652492500-ded49492fe66?w=400',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400'
  ],

  // Home & Kitchen
  'Mixer Grinder': [
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'
  ],
  'Microwave Oven': [
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'
  ],
  'Pressure Cooker': [
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'
  ],
  'Blender': [
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'
  ],
  'Toaster': [
    'https://images.unsplash.com/photo-1595220770325-e26c838aa49c?w=400',
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400'
  ],
  'Kettle': [
    'https://images.unsplash.com/photo-1595435742656-5272d0b3e6b8?w=400',
    'https://images.unsplash.com/photo-1563484677018-39b0b5055fd9?w=400'
  ],
  'Dinner Set': [
    'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'
  ],
  'Cookware Set': [
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    'https://images.unsplash.com/photo-1584990347449-f7d5d6f1a5e1?w=400'
  ],
  'Bedsheet': [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'
  ],
  'Curtains': [
    'https://images.unsplash.com/photo-1594026315524-4cdc7b57e10f?w=400',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400'
  ],
  'Cushion': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  ],
  'Carpet': [
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400'
  ],

  // Sports
  'Running Shoes': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400'
  ],
  'Training Shoes': [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400'
  ],
  'Football': [
    'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aac?w=400',
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400'
  ],
  'Cricket Bat': [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
    'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400'
  ],
  'Badminton Racket': [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
  ],
  'Yoga Mat': [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400'
  ],
  'Gym Bag': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400'
  ],
  'Dumbbells': [
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    'https://images.unsplash.com/photo-1638805981949-54e900fd2e98?w=400'
  ],
  'Sports Watch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400'
  ],

  // Books
  'Fiction': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'
  ],
  'Mystery': [
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
  ],
  'Thriller': [
    'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
  ],
  'Self-Help': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'
  ],
  'Biography': [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400'
  ],

  // Toys
  'Action Figure': [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400'
  ],
  'Doll': [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  ],
  'Board Game': [
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400',
    'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=400'
  ],
  'Puzzle': [
    'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=400',
    'https://images.unsplash.com/photo-1594736414360-c96e5b35a156?w=400'
  ],
  'Remote Control Car': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1469037784699-75dcff1cbf75?w=400'
  ],
  'Building Blocks': [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  ],
  'Soft Toy': [
    'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400',
    'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=400'
  ]
};

const getRandomImages = (type, count = 3) => {
  const availableImages = imagesByType[type] || imagesByType['Fiction'];
  const selectedImages = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    selectedImages.push(availableImages[randomIndex]);
  }

  return selectedImages;
};

const generateProducts = () => {
  const products = [];

  // Electronics - 100 products
  const electronicsBrands = ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'JBL', 'boAt', 'Noise'];
  const electronicsTypes = ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Earbuds', 'Headphones', 'Speaker', 'Power Bank', 'Charger', 'Mouse', 'Keyboard'];

  for (let i = 1; i <= 100; i++) {
    const brand = electronicsBrands[Math.floor(Math.random() * electronicsBrands.length)];
    const type = electronicsTypes[Math.floor(Math.random() * electronicsTypes.length)];
    const images = getRandomImages(type, 3);

    products.push({
      name: `${brand} ${type} ${i}`,
      category: 'Electronics',
      price: Math.floor(Math.random() * 90000) + 5000,
      description: `High-quality ${type.toLowerCase()} from ${brand} with advanced features. Perfect for daily use with excellent performance and battery life.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 100) + 10
    });
  }

  // Clothing - 120 products
  const clothingBrands = ['Zara', 'H&M', 'Levi\'s', 'Nike', 'Adidas', 'Puma', 'Roadster', 'Allen Solly', 'Peter England', 'Van Heusen', 'US Polo'];
  const clothingTypes = ['T-Shirt', 'Shirt', 'Jeans', 'Trousers', 'Jacket', 'Hoodie', 'Dress', 'Kurta', 'Saree', 'Ethnic Wear'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  for (let i = 1; i <= 120; i++) {
    const brand = clothingBrands[Math.floor(Math.random() * clothingBrands.length)];
    const type = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const images = getRandomImages(type, 3);

    products.push({
      name: `${brand} ${type} - ${size}`,
      category: 'Clothing',
      price: Math.floor(Math.random() * 3500) + 500,
      description: `Stylish ${type.toLowerCase()} from ${brand}. Available in size ${size}. Made with premium quality fabric for maximum comfort.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 80) + 15
    });
  }

  // Home & Kitchen - 100 products
  const homeKitchenTypes = ['Mixer Grinder', 'Microwave Oven', 'Rice Cooker', 'Induction Cooktop', 'Air Fryer', 'Toaster', 'Kettle', 'Blender', 'Pressure Cooker', 'Dinner Set', 'Cookware Set', 'Bedsheet', 'Curtains', 'Cushion', 'Carpet'];
  const homeKitchenBrands = ['Prestige', 'Philips', 'Bajaj', 'Pigeon', 'Butterfly', 'Milton', 'Cello', 'Borosil', 'Wonderchef'];

  for (let i = 1; i <= 100; i++) {
    const brand = homeKitchenBrands[Math.floor(Math.random() * homeKitchenBrands.length)];
    const type = homeKitchenTypes[Math.floor(Math.random() * homeKitchenTypes.length)];
    const images = getRandomImages(type, 3);

    products.push({
      name: `${brand} ${type} ${i}`,
      category: 'Home & Kitchen',
      price: Math.floor(Math.random() * 15000) + 1000,
      description: `Premium quality ${type.toLowerCase()} from ${brand}. Durable and efficient for your home and kitchen needs.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 60) + 10
    });
  }

  // Sports - 80 products
  const sportsTypes = ['Running Shoes', 'Training Shoes', 'Football', 'Cricket Bat', 'Badminton Racket', 'Yoga Mat', 'Gym Bag', 'Sports Watch', 'Dumbbells'];
  const sportsBrands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Asics', 'New Balance', 'Decathlon', 'Nivia'];

  for (let i = 1; i <= 80; i++) {
    const brand = sportsBrands[Math.floor(Math.random() * sportsBrands.length)];
    const type = sportsTypes[Math.floor(Math.random() * sportsTypes.length)];
    const images = getRandomImages(type, 3);

    products.push({
      name: `${brand} ${type} ${i}`,
      category: 'Sports',
      price: Math.floor(Math.random() * 8000) + 500,
      description: `Professional ${type.toLowerCase()} from ${brand}. Perfect for athletes and fitness enthusiasts. High quality and durable.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 70) + 15
    });
  }

  // Books - 60 products
  const bookGenres = ['Fiction', 'Mystery', 'Thriller', 'Romance', 'Self-Help', 'Biography', 'History', 'Science', 'Technology', 'Business', 'Cooking', 'Travel'];
  const authors = ['Chetan Bhagat', 'Amish Tripathi', 'Ruskin Bond', 'R.K. Narayan', 'Sudha Murty', 'Paulo Coelho', 'Dan Brown', 'J.K. Rowling', 'George R.R. Martin'];

  for (let i = 1; i <= 60; i++) {
    const genre = bookGenres[Math.floor(Math.random() * bookGenres.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const images = getRandomImages(genre, 3);

    products.push({
      name: `${genre} Book ${i} by ${author}`,
      category: 'Books',
      price: Math.floor(Math.random() * 800) + 200,
      description: `Bestselling ${genre.toLowerCase()} book by ${author}. A must-read for book lovers. Paperback edition.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 100) + 20
    });
  }

  // Toys - 60 products
  const toyTypes = ['Action Figure', 'Doll', 'Board Game', 'Puzzle', 'Remote Control Car', 'Building Blocks', 'Soft Toy'];
  const toyBrands = ['Hot Wheels', 'Barbie', 'Lego', 'Nerf', 'Hasbro', 'Mattel', 'Fisher-Price', 'Funskool'];

  for (let i = 1; i <= 60; i++) {
    const brand = toyBrands[Math.floor(Math.random() * toyBrands.length)];
    const type = toyTypes[Math.floor(Math.random() * toyTypes.length)];
    const images = getRandomImages(type, 3);

    products.push({
      name: `${brand} ${type} ${i}`,
      category: 'Toys',
      price: Math.floor(Math.random() * 3000) + 300,
      description: `Fun and exciting ${type.toLowerCase()} from ${brand}. Perfect gift for kids. Safe and durable.`,
      images: images,
      image: images[0],
      stock: Math.floor(Math.random() * 90) + 15
    });
  }

  return products;
};

const insertProducts = async () => {
  try {
    // Optional: Clear existing products
    // await Product.deleteMany({});

    const products = generateProducts();
    await Product.insertMany(products);

    console.log(`✅ Successfully inserted ${products.length} products!`);
    console.log('\nCategories breakdown:');
    console.log('- Electronics: 100 products');
    console.log('- Clothing: 120 products');
    console.log('- Home & Kitchen: 100 products');
    console.log('- Sports: 80 products');
    console.log('- Books: 60 products');
    console.log('- Toys: 60 products');
    console.log('Total: 520 products with varied images');

    process.exit(0);
  } catch (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }
};

insertProducts();
