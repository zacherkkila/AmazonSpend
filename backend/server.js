const express = require('express');
const cors = require('cors');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const { detectCategory } = require('./utils/categoryDetector');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Read and parse CSV file
const parseCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(__dirname, 'OrderHistory.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found at:', csvPath);
      return reject(new Error('CSV file not found'));
    }

    console.log('Reading CSV file from:', csvPath);
    
    fs.createReadStream(csvPath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true
      }))
      .on('data', (data) => {
        try {
          // Clean and validate the data
          const cleanedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.trim(),
              value ? value.toString().trim() : ''
            ])
          );
          results.push(cleanedData);
        } catch (err) {
          console.error('Error processing row:', err);
        }
      })
      .on('end', () => {
        console.log(`Successfully parsed ${results.length} rows`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });
  });
};

// API endpoints
app.get('/api/purchases', async (req, res) => {
  try {
    const purchases = await parseCSV();
    res.json(purchases);
  } catch (error) {
    console.error('Error in /api/purchases:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  console.log('Received analytics request');
  try {
    console.log('Starting CSV parsing...');
    const purchases = await parseCSV();
    console.log(`Successfully parsed ${purchases.length} purchases`);
    
    const totalSpent = purchases.reduce((sum, purchase) => sum + parseFloat(purchase['Total Owed']), 0);
    console.log('Calculated total spent:', totalSpent);
    
    // Calculate purchases by month
    const purchasesByMonth = {};
    purchases.forEach(purchase => {
      const date = new Date(purchase['Order Date']);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      purchasesByMonth[monthYear] = (purchasesByMonth[monthYear] || 0) + parseFloat(purchase['Total Owed']);
    });
    console.log('Calculated monthly purchases');

    // Calculate purchases by year and category
    const yearlyCategoryTotals = {};
    purchases.forEach(purchase => {
      const date = new Date(purchase['Order Date']);
      const year = date.getFullYear().toString();
      const category = detectCategory(purchase['Product Name']);
      
      if (!yearlyCategoryTotals[year]) {
        yearlyCategoryTotals[year] = {};
      }
      yearlyCategoryTotals[year][category] = (yearlyCategoryTotals[year][category] || 0) + parseFloat(purchase['Total Owed']);
    });
    console.log('Calculated yearly category totals');

    // Calculate yearly totals
    const yearlyTotals = {};
    Object.entries(yearlyCategoryTotals).forEach(([year, categories]) => {
      yearlyTotals[year] = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
    });
    console.log('Calculated yearly totals');

    // Calculate category totals
    const categories = {};
    purchases.forEach(purchase => {
      const category = detectCategory(purchase['Product Name']);
      categories[category] = (categories[category] || 0) + parseFloat(purchase['Total Owed']);
    });
    console.log('Calculated category totals');

    // Calculate histogram
    const histogram = {};
    purchases.forEach(purchase => {
      const amount = parseFloat(purchase['Total Owed']);
      let binLabel;
      
      if (amount < 10) {
        binLabel = '$0-10';
      } else if (amount < 20) {
        binLabel = '$10-20';
      } else if (amount < 50) {
        binLabel = '$20-50';
      } else if (amount < 100) {
        binLabel = '$50-100';
      } else if (amount < 200) {
        binLabel = '$100-200';
      } else if (amount < 500) {
        binLabel = '$200-500';
      } else if (amount < 1000) {
        binLabel = '$500-1000';
      } else {
        binLabel = '$1000+';
      }
      
      histogram[binLabel] = (histogram[binLabel] || 0) + 1;
    });
    console.log('Calculated histogram');

    console.log('Sending response...');
    res.json({
      totalSpent,
      purchasesByMonth,
      yearlyTotals,
      yearlyCategoryTotals,
      categories,
      histogram
    });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error processing analytics:', error);
    res.status(500).json({ error: 'Failed to process analytics' });
  }
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend is running!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 