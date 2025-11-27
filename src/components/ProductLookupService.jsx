// ProductLookupService.js
// Free barcode lookup using Open Food Facts API (no API key required)

const ProductLookupService = {
  /**
   * Search for product by barcode using Open Food Facts API
   * @param {string} barcode - The barcode number
   * @returns {Promise<object|null>} Product data or null if not found
   */
  searchByBarcode: async (barcode) => {
    try {
      // Open Food Facts API - completely free, no auth required
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Check if product was found
      if (data.status === 0 || !data.product) {
        return null;
      }
      
      // Extract relevant product information
      const product = data.product;
      
      return {
        found: true,
        name: product.product_name || product.generic_name || 'Unknown Product',
        brand: product.brands || '',
        category: detectCategory(product),
        image: product.image_url || product.image_front_url || null,
        quantity: product.quantity || '',
        // Estimate cost (Open Food Facts doesn't have prices)
        estimatedCost: null,
        barcode: barcode,
        rawData: product
      };
      
    } catch (error) {
      console.error('Error fetching product data:', error);
      throw error;
    }
  },

  /**
   * Search for product by name (fallback when barcode fails)
   * @param {string} query - Search query
   * @returns {Promise<array>} Array of matching products
   */
  searchByName: async (query) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=10`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
        return [];
      }
      
      return data.products.map(product => ({
        name: product.product_name || 'Unknown Product',
        brand: product.brands || '',
        category: detectCategory(product),
        image: product.image_url || null,
        barcode: product.code || ''
      }));
      
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
};

/**
 * Detect the appropriate storage category based on product data
 * @param {object} product - Product data from API
 * @returns {string} - 'fridge', 'freezer', or 'pantry'
 */
function detectCategory(product) {
  const categories = product.categories_tags || product.categories || '';
  const name = (product.product_name || '').toLowerCase();
  const categoryString = categories.toString().toLowerCase();
  
  // Fridge items (perishables)
  const fridgeKeywords = [
    'milk', 'dairy', 'cheese', 'yogurt', 'yoghurt', 'cream',
    'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood',
    'fresh', 'refrigerat', 'egg', 'butter',
    'vegetable', 'fruit', 'salad', 'lettuce', 'tomato',
    'juice', 'drink', 'beverage'
  ];
  
  // Freezer items
  const freezerKeywords = [
    'frozen', 'ice cream', 'ice-cream', 'pizza', 'freezer'
  ];
  
  // Check for fridge items
  for (const keyword of fridgeKeywords) {
    if (name.includes(keyword) || categoryString.includes(keyword)) {
      return 'fridge';
    }
  }
  
  // Check for freezer items
  for (const keyword of freezerKeywords) {
    if (name.includes(keyword) || categoryString.includes(keyword)) {
      return 'freezer';
    }
  }
  
  // Default to pantry for shelf-stable items
  return 'pantry';
}

/**
 * Get default expiry days based on category
 * @param {string} category - 'fridge', 'freezer', or 'pantry'
 * @returns {number} - Number of days until expiry
 */
export function getDefaultExpiryDays(category) {
  const defaults = {
    fridge: 7,
    freezer: 90,
    pantry: 365
  };
  return defaults[category] || 7;
}

export default ProductLookupService;
