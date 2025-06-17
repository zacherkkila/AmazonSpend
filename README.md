# Amazon Purchase Analyzer

Pure Claude AI Created Vibe Code Test to Analyze Spending

Yeah it doesn't have typescript and a lot of it is probably garbage.. I haven't even read the code

## Quick Start

1. Drop your `OrderHistory.csv` file in the `backend` folder
   - You can get this from Amazon's "Your Orders" page
   - Click "Download Order Reports" and select "Items" report type
   - Rename it to `OrderHistory.csv` and drop it in the `backend` folder

2. Run the dev environment:
```bash
./dev.sh
```

This will start both the frontend and backend in development mode with hot reloading.

## Features

- 📊 Monthly spending trends
- 🍕 Spending by category (with percentages)
- 📈 Yearly spending breakdown
- 💰 Purchase amount distribution
- 📝 Detailed purchase table with search and sort
- 📊 Average purchase amount by category

## Tech Stack

- Frontend: React + Material-UI + Chart.js
- Backend: Node.js + Express
- Development: Docker + Hot Reloading

## Development

The app runs in development mode with hot reloading enabled. Any changes to the frontend or backend code will automatically trigger a rebuild.

To stop the development environment:
```bash
docker-compose down
```

## Notes

- The CSV file is gitignored for privacy
- Make sure to use the "Items" report type from Amazon
- The app assumes USD currency 