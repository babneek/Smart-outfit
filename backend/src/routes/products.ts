import { Router } from 'express';

const router = Router();

// Mock product data
const products = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    price: 49.99,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    description: 'A light, floral dress perfect for summer outings.'
  },
  {
    id: 2,
    name: 'Classic Blue Jeans',
    price: 39.99,
    image: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg',
    description: 'Timeless blue jeans with a comfortable fit.'
  },
  {
    id: 3,
    name: 'White Cotton Shirt',
    price: 29.99,
    image: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg',
    description: 'A crisp, white cotton shirt for any occasion.'
  },
  {
    id: 4,
    name: 'Green T-Shirt',
    price: 19.99,
    image: 'https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg',
    description: 'Soft green t-shirt, great for casual wear.'
  }
];

// GET /api/products
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// POST /api/products
router.post('/', (req, res) => {
  res.json({ message: 'Create product - to be implemented' });
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  res.json({ message: 'Update product - to be implemented' });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete product - to be implemented' });
});

// POST /api/products/upload-image
router.post('/upload-image', (req, res) => {
  res.json({ message: 'Upload product image - to be implemented' });
});

export default router; 