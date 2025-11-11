// lib/storage.js
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
const ensureDataDirectory = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize default files if they don't exist
const initializeDefaultFiles = () => {
  ensureDataDirectory();
  
  const defaultFiles = {
    'products.json': { 
      products: [
        {
          id: '1',
          name: 'Premium Full Sleeve T-Shirts - 3 Pcs Package',
          price: 990,
          description: 'Summer Collection - Imported Chine Mash Fabric',
          features: [
            'Comfortable and premium fabric',
            'Casual style perfect for summer',
            'Available in multiple sizes'
          ],
          sizes: ['M', 'L', 'XL', '2XL'],
          images: [''],
          createdAt: new Date().toISOString()
        }
      ] 
    },
    'orders.json': { orders: [] },
    'settings.json': { 
      siteTitle: 'T-Shirt Shop',
      currency: 'BDT',
      shippingRates: {
        'inside-dhaka': 60,
        'outside-dhaka': 120
      }
    }
  };

  Object.entries(defaultFiles).forEach(([filename, defaultData]) => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Creating ${filename}...`);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  });
};

// Initialize files on module load
initializeDefaultFiles();

export const storage = {
  // Read data from file
  read(file) {
    try {
      const filePath = path.join(dataDir, `${file}.json`);
      if (!fs.existsSync(filePath)) {
        console.log(`File ${filePath} does not exist`);
        return null;
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
      return null;
    }
  },

  // Write data to file
  write(file, data) {
    try {
      ensureDataDirectory();
      const filePath = path.join(dataDir, `${file}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${file}:`, error);
      return false;
    }
  },

  // Add item to collection
  add(file, item) {
    const data = this.read(file);
    if (data && Array.isArray(data[file])) {
      item.id = Date.now().toString();
      item.createdAt = new Date().toISOString();
      data[file].unshift(item);
      return this.write(file, data);
    }
    return false;
  },

  // Update item in collection
  update(file, id, updates) {
    const data = this.read(file);
    if (data && Array.isArray(data[file])) {
      const index = data[file].findIndex(item => item.id === id);
      if (index !== -1) {
        data[file][index] = { ...data[file][index], ...updates };
        return this.write(file, data);
      }
    }
    return false;
  },

  // Delete item from collection
  delete(file, id) {
    const data = this.read(file);
    if (data && Array.isArray(data[file])) {
      data[file] = data[file].filter(item => item.id !== id);
      return this.write(file, data);
    }
    return false;
  }
};