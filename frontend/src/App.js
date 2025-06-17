import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  ThemeProvider,
  createTheme,
  GlobalStyles
} from '@mui/material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
} from 'chart.js';
import axios from 'axios';
import PurchaseTable from './components/PurchaseTable';
import { getCategoryColor, getCategoryColorWithOpacity, detectCategory } from './utils/categoryDetector';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [error, setError] = useState(null);
  const [averagePurchaseData, setAveragePurchaseData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test');
        console.log('Backend connection test:', response.data);
      } catch (error) {
        console.error('Backend connection test failed:', error);
        setError('Cannot connect to backend server. Please ensure it is running.');
      }
    };

    const fetchData = async () => {
      try {
        setError(null);
        const [analyticsResponse, purchasesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics'),
          axios.get('http://localhost:5000/api/purchases')
        ]);
        
        setAnalytics(analyticsResponse.data);

        // Calculate average purchase amount by category
        const categoryAverages = {};
        const categoryCounts = {};
        
        purchasesResponse.data.forEach(purchase => {
          if (purchase['Product Name'] && purchase['Total Owed']) {
            const category = detectCategory(purchase['Product Name']);
            const amount = parseFloat(purchase['Total Owed']);
            if (!isNaN(amount)) {
              categoryAverages[category] = (categoryAverages[category] || 0) + amount;
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
          }
        });

        Object.keys(categoryAverages).forEach(category => {
          categoryAverages[category] = categoryAverages[category] / categoryCounts[category];
        });

        setAveragePurchaseData({
          labels: Object.keys(categoryAverages),
          datasets: [
            {
              label: 'Average Purchase Amount',
              data: Object.values(categoryAverages),
              backgroundColor: Object.keys(categoryAverages).map(category => 
                getCategoryColorWithOpacity(category)
              ),
              borderColor: Object.keys(categoryAverages).map(category => 
                getCategoryColor(category)
              ),
              borderWidth: 1
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch analytics data. Please try again later.');
      }
    };

    testConnection();
    fetchData();
  }, []);

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please ensure:
            <ul>
              <li>The backend server is running on port 5000</li>
              <li>You have the CSV file in the correct location</li>
              <li>There are no network connectivity issues</li>
            </ul>
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!analytics || !averagePurchaseData) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3 }}>
          <Typography>Loading analytics data...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const monthlyData = {
    labels: Object.keys(analytics.purchasesByMonth).sort(),
    datasets: [
      {
        label: 'Monthly Spending',
        data: Object.keys(analytics.purchasesByMonth)
          .sort()
          .map(month => analytics.purchasesByMonth[month]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for stacked yearly chart
  const years = Object.keys(analytics.yearlyTotals).sort();
  const categories = Object.keys(analytics.categories);
  
  const yearlyStackedData = {
    labels: years,
    datasets: categories.map(category => ({
      label: category,
      data: years.map(year => analytics.yearlyCategoryTotals[year]?.[category] || 0),
      backgroundColor: getCategoryColorWithOpacity(category),
      borderColor: getCategoryColor(category),
      borderWidth: 1
    }))
  };

  // Calculate histogram
  const histogram = {};
  const purchases = Object.values(analytics.histogram);
  purchases.forEach(purchase => {
    const amount = parseFloat(purchase['Total Owed']);
    // Use smaller bins for lower amounts, larger for higher amounts
    let bin;
    if (amount < 10) {
      bin = Math.floor(amount);
    } else if (amount < 100) {
      bin = Math.floor(amount / 10) * 10;
    } else if (amount < 1000) {
      bin = Math.floor(amount / 100) * 100;
    } else {
      bin = Math.floor(amount / 1000) * 1000;
    }
    histogram[bin] = (histogram[bin] || 0) + 1;
  });

  const histogramData = {
    labels: [
      '$0-10',
      '$10-20',
      '$20-50',
      '$50-100',
      '$100-200',
      '$200-500',
      '$500-1000',
      '$1000+'
    ],
    datasets: [
      {
        label: 'Number of Purchases',
        data: [
          '$0-10',
          '$10-20',
          '$20-50',
          '$50-100',
          '$100-200',
          '$200-500',
          '$500-1000',
          '$1000+'
        ].map(bin => analytics.histogram[bin] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(analytics.categories).map(category => {
      const total = analytics.categories[category];
      const percentage = ((total / analytics.totalSpent) * 100).toFixed(1);
      return `${category} (${percentage}%)`;
    }),
    datasets: [
      {
        data: Object.values(analytics.categories),
        backgroundColor: Object.keys(analytics.categories).map(category => 
          getCategoryColorWithOpacity(category)
        ),
        borderColor: Object.keys(analytics.categories).map(category => 
          getCategoryColor(category)
        ),
        borderWidth: 1
      },
    ],
  };

  const renderDashboard = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Amazon Purchase Analysis
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Spent: ${analytics.totalSpent.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Spending
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount ($)'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <Box sx={{ height: 400 }}>
              <Pie
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 20,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Yearly Spending by Category
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar
                data={yearlyStackedData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount ($)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Purchase Amount Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar
                data={histogramData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Purchases'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Average Purchase Amount by Category
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar
                data={averagePurchaseData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Average Amount ($)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Amazon Purchase Analyzer
            </Typography>
            <Button 
              color="inherit" 
              onClick={() => setCurrentPage('dashboard')}
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setCurrentPage('table')}
            >
              Purchase Table
            </Button>
          </Toolbar>
        </AppBar>
        
        {currentPage === 'dashboard' ? renderDashboard() : <PurchaseTable />}
      </Box>
    </ThemeProvider>
  );
}

export default App; 