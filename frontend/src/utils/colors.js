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