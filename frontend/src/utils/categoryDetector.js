// Color palette for categories
export const categoryColors = {
  'Electronics': '#2196F3', // Blue
  'Books & Media': '#4CAF50', // Green
  'Clothing & Fashion': '#FF9800', // Orange
  'Home & Kitchen': '#9C27B0', // Purple
  'Beauty & Personal Care': '#E91E63', // Pink
  'Sports & Outdoors': '#795548', // Brown
  'Toys & Games': '#FFEB3B', // Yellow
  'Food & Grocery': '#F44336', // Red
  'Health & Medical': '#00BCD4', // Cyan
  'Office & School': '#607D8B', // Blue Grey
  'Other': '#9E9E9E' // Grey
};

// Helper function to get color for a category
export const getCategoryColor = (category) => categoryColors[category] || categoryColors['Other'];

// Helper function to get background color with opacity
export const getCategoryColorWithOpacity = (category, opacity = 0.5) => {
  const color = getCategoryColor(category);
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
};

// Category detection function
export const detectCategory = (productName) => {
  const name = productName.toLowerCase();
  
  // Define category keywords
  const categoryKeywords = {
    'Electronics': ['phone', 'laptop', 'computer', 'tablet', 'camera', 'headphones', 'speaker', 'monitor', 'keyboard', 'mouse', 'charger', 'cable', 'battery', 'power', 'electronic', 'gadget', 'device'],
    'Books & Media': ['book', 'kindle', 'ebook', 'dvd', 'cd', 'movie', 'music', 'audio', 'video', 'game', 'console', 'playstation', 'xbox', 'nintendo'],
    'Clothing & Fashion': ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'socks', 'underwear', 'bra', 'lingerie', 'accessory', 'jewelry', 'watch', 'bag', 'purse', 'wallet'],
    'Home & Kitchen': ['kitchen', 'cookware', 'utensil', 'appliance', 'furniture', 'decor', 'lighting', 'bedding', 'bath', 'cleaning', 'storage', 'organizer'],
    'Beauty & Personal Care': ['beauty', 'cosmetic', 'makeup', 'skincare', 'hair', 'shampoo', 'conditioner', 'soap', 'lotion', 'perfume', 'cologne', 'deodorant'],
    'Sports & Outdoors': ['sport', 'fitness', 'exercise', 'outdoor', 'camping', 'hiking', 'biking', 'swimming', 'yoga', 'gym', 'equipment'],
    'Toys & Games': ['toy', 'game', 'puzzle', 'board game', 'card game', 'stuffed animal', 'doll', 'action figure'],
    'Food & Grocery': ['food', 'grocery', 'snack', 'beverage', 'drink', 'coffee', 'tea', 'water', 'candy', 'chocolate'],
    'Health & Medical': ['health', 'medical', 'medicine', 'supplement', 'vitamin', 'first aid', 'bandage', 'pill', 'drug'],
    'Office & School': ['office', 'school', 'stationery', 'pen', 'pencil', 'paper', 'notebook', 'folder', 'binder', 'desk', 'chair']
  };

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}; 