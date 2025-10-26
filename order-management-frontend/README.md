# Order Management System

This is a simple order management system built with React and TailwindCSS. The application allows users to list, create, and view order details.

## Project Structure

```
order-management-frontend
├── index.html          # Main HTML entry point
├── package.json        # NPM configuration file
├── tsconfig.json       # TypeScript configuration file
├── vite.config.ts      # Vite configuration file
├── tailwind.config.js   # TailwindCSS configuration file
├── postcss.config.js   # PostCSS configuration file
├── .gitignore          # Git ignore file
└── src
    ├── main.tsx       # Entry point for the React application
    ├── App.tsx        # Main App component
    ├── index.css      # Global CSS styles
    ├── pages
    │   ├── OrdersList.tsx   # Component to display a list of orders
    │   ├── OrderCreate.tsx   # Component for creating new orders
    │   └── OrderDetails.tsx  # Component for viewing order details
    ├── components
    │   ├── OrderList.tsx     # Renders the list of orders
    │   ├── OrderForm.tsx     # Used for creating or editing orders
    │   └── OrderCard.tsx     # Represents a single order in the list
    ├── services
    │   └── api.ts            # Functions for making API calls related to orders
    ├── hooks
    │   └── useOrders.ts      # Custom hook for managing orders
    ├── types
    │   └── order.ts          # TypeScript interfaces related to orders
    └── utils
        └── formatDate.ts     # Utility function for formatting dates
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd order-management-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to see the application in action.

## Features

- List all orders
- Create new orders
- View details of a specific order

## Technologies Used

- React
- TypeScript
- TailwindCSS
- Vite

## License

This project is licensed under the MIT License.