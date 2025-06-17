# Amazon Purchase History Analyzer

This application analyzes your Amazon purchase history and provides visual insights through interactive charts.

## Features

- Total spending analysis
- Monthly spending trends
- Category-wise spending breakdown
- Interactive charts and graphs
- Modern Material-UI interface

## Prerequisites

- Docker and Docker Compose installed on your system
- Amazon purchase history CSV file (Retail.OrderHistory.1.csv)

## Getting Started

1. Make sure your Amazon purchase history CSV file (Retail.OrderHistory.1.csv) is in the root directory of the project.

2. Build and start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Development

If you want to run the application in development mode:

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. In a separate terminal, start the frontend:
   ```bash
   npm run client
   ```

## Technologies Used

- Backend: Node.js, Express
- Frontend: React, Material-UI, Chart.js
- Containerization: Docker
- Data Processing: csv-parse 