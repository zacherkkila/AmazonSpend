const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Category keywords and their associated categories
const categoryKeywords = {
  'Electronics': [
    'electronics', 'computer', 'laptop', 'desktop', 'monitor', 'keyboard', 'mouse',
    'cable', 'charger', 'adapter', 'usb', 'hdmi', 'display', 'screen', 'printer',
    'scanner', 'speaker', 'headphone', 'earphone', 'microphone', 'camera', 'phone',
    'smartphone', 'tablet', 'ipad', 'kindle', 'gadget', 'device', 'battery', 'power',
    'wireless', 'bluetooth', 'wifi', 'router', 'modem', 'network', 'storage', 'ssd',
    'hard drive', 'memory', 'ram', 'processor', 'cpu', 'gpu', 'graphics'
  ],
  'Books & Media': [
    'book', 'ebook', 'kindle', 'textbook', 'novel', 'magazine', 'journal', 'dvd',
    'blu-ray', 'cd', 'vinyl', 'record', 'movie', 'film', 'documentary', 'music',
    'album', 'audiobook', 'podcast', 'comic', 'manga', 'graphic novel'
  ],
  'Clothing & Fashion': [
    'clothing', 'clothes', 'shirt', 't-shirt', 'pants', 'jeans', 'dress', 'skirt',
    'jacket', 'coat', 'sweater', 'hoodie', 'sweatshirt', 'underwear', 'socks',
    'shoes', 'boots', 'sneakers', 'sandals', 'accessory', 'jewelry', 'watch',
    'bracelet', 'necklace', 'ring', 'earring', 'bag', 'purse', 'backpack', 'wallet',
    'belt', 'hat', 'cap', 'scarf', 'gloves', 'sunglasses'
  ],
  'Home & Kitchen': [
    'home', 'kitchen', 'appliance', 'furniture', 'bed', 'mattress', 'sofa', 'chair',
    'table', 'desk', 'cabinet', 'shelf', 'storage', 'organizer', 'decor', 'art',
    'picture', 'frame', 'light', 'lamp', 'cookware', 'utensil', 'dish', 'plate',
    'bowl', 'cup', 'glass', 'mug', 'cutlery', 'knife', 'fork', 'spoon', 'pan',
    'pot', 'bakeware', 'appliance', 'refrigerator', 'oven', 'microwave', 'toaster',
    'blender', 'mixer', 'coffee maker', 'kettle'
  ],
  'Beauty & Personal Care': [
    'beauty', 'cosmetic', 'makeup', 'skincare', 'facial', 'cleanser', 'moisturizer',
    'serum', 'cream', 'lotion', 'shampoo', 'conditioner', 'hair', 'styling',
    'perfume', 'cologne', 'fragrance', 'deodorant', 'soap', 'body wash', 'toothpaste',
    'dental', 'oral care', 'razor', 'shaving', 'grooming', 'nail', 'manicure',
    'pedicure', 'brush', 'comb', 'mirror'
  ],
  'Sports & Outdoors': [
    'sport', 'fitness', 'exercise', 'workout', 'gym', 'equipment', 'outdoor',
    'camping', 'hiking', 'backpacking', 'tent', 'sleeping bag', 'bike', 'bicycle',
    'cycling', 'running', 'jogging', 'yoga', 'pilates', 'dumbbell', 'weight',
    'resistance', 'ball', 'racket', 'club', 'fishing', 'hunting', 'golf', 'tennis',
    'basketball', 'football', 'soccer'
  ],
  'Toys & Games': [
    'toy', 'game', 'puzzle', 'board game', 'card game', 'video game', 'console',
    'controller', 'lego', 'building', 'construction', 'doll', 'action figure',
    'stuffed animal', 'plush', 'educational', 'learning', 'craft', 'art', 'coloring',
    'book', 'paint', 'drawing', 'model', 'kit'
  ],
  'Food & Grocery': [
    'food', 'grocery', 'snack', 'candy', 'chocolate', 'beverage', 'drink', 'water',
    'coffee', 'tea', 'juice', 'soda', 'alcohol', 'wine', 'beer', 'spirit', 'spice',
    'herb', 'condiment', 'sauce', 'dressing', 'cereal', 'breakfast', 'pasta',
    'rice', 'grain', 'canned', 'frozen', 'fresh', 'organic', 'natural'
  ],
  'Health & Medical': [
    'health', 'medical', 'medicine', 'supplement', 'vitamin', 'mineral', 'protein',
    'nutrition', 'diet', 'weight', 'fitness', 'exercise', 'first aid', 'bandage',
    'band-aid', 'ointment', 'cream', 'pill', 'capsule', 'tablet', 'syrup',
    'inhaler', 'brace', 'support', 'mobility', 'wheelchair', 'cane', 'walker'
  ],
  'Office & School': [
    'office', 'school', 'stationery', 'paper', 'notebook', 'pen', 'pencil',
    'marker', 'highlighter', 'folder', 'binder', 'organizer', 'desk', 'chair',
    'lamp', 'calculator', 'printer', 'ink', 'toner', 'cartridge', 'stapler',
    'scissors', 'tape', 'glue', 'clip', 'pin', 'rubber band', 'envelope'
  ]
};

// Create a map of keywords to categories for faster lookup
const keywordToCategory = {};
Object.entries(categoryKeywords).forEach(([category, keywords]) => {
  keywords.forEach(keyword => {
    keywordToCategory[keyword] = category;
  });
});

function detectCategory(productName) {
  if (!productName) return 'Other';

  // Tokenize and normalize the product name
  const tokens = tokenizer.tokenize(productName.toLowerCase());
  if (!tokens) return 'Other';

  // Count category matches
  const categoryMatches = {};
  
  tokens.forEach(token => {
    // Check for exact matches
    if (keywordToCategory[token]) {
      const category = keywordToCategory[token];
      categoryMatches[category] = (categoryMatches[category] || 0) + 1;
    }
    
    // Check for partial matches
    Object.entries(keywordToCategory).forEach(([keyword, category]) => {
      if (token.includes(keyword) || keyword.includes(token)) {
        categoryMatches[category] = (categoryMatches[category] || 0) + 0.5;
      }
    });
  });

  // Find the category with the most matches
  let bestCategory = 'Other';
  let bestScore = 0;

  Object.entries(categoryMatches).forEach(([category, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  return bestCategory;
}

module.exports = {
  detectCategory,
  getCategories: () => Object.keys(categoryKeywords)
}; 