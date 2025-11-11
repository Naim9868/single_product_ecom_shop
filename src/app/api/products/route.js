// app/api/products/route.js
import fs from 'fs';
import path from 'path';

// Sample products data
const sampleProducts = {
  products: [
    {
      id: "1",
      name: "Premium Full Sleeve T-Shirts - 3 Pcs Package",
      price: 990,
      description: "Summer Collection - Imported Chine Mash Fabric",
      features: [
        "Comfortable and premium fabric",
        "Casual style perfect for summer",
        "Available in multiple sizes"
      ],
      sizes: ["M", "L", "XL", "2XL"],
      images: [""],
      createdAt: new Date().toISOString()
    }
  ]
};

function ensureProductsFile() {
  const dataDir = path.join(process.cwd(), 'data');
  const productsPath = path.join(dataDir, 'products.json');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create products.json with sample data if it doesn't exist or is empty
  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, JSON.stringify(sampleProducts, null, 2));
    console.log('Created products.json with sample data');
    return sampleProducts;
  }
  
  // Read existing file
  try {
    const fileData = fs.readFileSync(productsPath, 'utf8');
    const parsedData = JSON.parse(fileData);
    
    // If products array is empty, repopulate with sample data
    if (!parsedData.products || parsedData.products.length === 0) {
      console.log('Products array is empty, repopulating with sample data');
      fs.writeFileSync(productsPath, JSON.stringify(sampleProducts, null, 2));
      return sampleProducts;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error reading products file, using sample data:', error);
    // If file is corrupted, rewrite it
    fs.writeFileSync(productsPath, JSON.stringify(sampleProducts, null, 2));
    return sampleProducts;
  }
}

export async function GET() {
  try {
    console.log('📦 Fetching products...');
    
    // Ensure we have valid products data
    const productsData = ensureProductsFile();
    
    console.log('✅ Products loaded:', productsData.products.length);
    
    return Response.json(productsData);
    
  } catch (error) {
    console.error('❌ Error in products API:', error);
    // Always return sample data as fallback
    return Response.json(sampleProducts);
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    const dataDir = path.join(process.cwd(), 'data');
    const productsPath = path.join(dataDir, 'products.json');
    
    // Read existing products or use sample
    let productsData = ensureProductsFile();
    
    // Add new product
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    productsData.products.unshift(productWithId);
    
    // Save back to file
    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
    
    return Response.json({ 
      success: true, 
      message: 'Product added successfully',
      product: productWithId 
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to create product' 
    }, { status: 500 });
  }
}