import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

async function run() {
  console.log('Testing E2E endpoints on http://localhost:5000...');

  // 1. Health
  const health = await api.get('/health');
  console.log('✔ GET /api/health:', health.data.status);

  // 2. Products
  const products = await api.get('/products');
  console.log(`✔ GET /api/products: ${products.data.count} products retrieved`);

  // 3. Signup customer
  const rand = Math.floor(1000 + Math.random() * 9000);
  const signup = await api.post('/auth/signup', {
    name: 'Jane Doe',
    email: `jane${rand}@example.com`,
    password: 'Password@123',
  });
  console.log('✔ POST /api/auth/signup: User created with ID', signup.data.user.id);
  const userToken = signup.data.token;

  // 4. Me
  const me = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('✔ GET /api/auth/me: Authenticated as', me.data.user.email);

  // 5. Place order
  const order = await api.post('/orders', {
    items: [
      { productId: 1, name: 'Studio Wireless Headphones', price: 2499, quantity: 1 }
    ],
    shippingAddress: {
      fullName: 'Jane Doe',
      phone: '9876543210',
      line1: '123 Avenue',
      city: 'Mumbai',
      state: 'MH',
      pincode: '400001',
    },
    paymentMethod: 'cod',
  }, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`✔ POST /api/orders: Order placed [${order.data.order.orderNumber}] total ₹${order.data.order.totalAmount}`);

  // 6. Admin login
  const adminRes = await api.post('/auth/login', {
    email: 'admin@swiftcart.com',
    password: 'Admin@12345',
    adminOnly: true,
  });
  const adminToken = adminRes.data.token;
  console.log('✔ POST /api/auth/login: Platform Admin logged in');

  // 7. Admin stats
  const stats = await api.get('/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('✔ GET /api/admin/stats:', stats.data.stats);

  console.log('\n⭐ ALL BACKEND + MONGODB OPERATIONS PASSED WITH 100% SUCCESS!');
}

run().catch((err) => {
  console.error('❌ Test failed:', err.response?.data || err.message);
  process.exit(1);
});

