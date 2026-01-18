# Findr

Findr is a route finding application that allows users to select a vehicle type and see a route on a map. It utilizes Leaflet for mapping.

## Structure

The project is divided into two main parts:

-   **`client/`**: The frontend React application.
-   **`server/`**: The backend Express application.

## Features

-   **Interactive Map**: Displays a map using Leaflet.
-   **Route Calculation**: detailed routing (mocked/implemented backend logic).
-   **Vehicle Selection**: Choose between different vehicle types (Car, Truck, Scooter).

## Getting Started

### Prerequisites

-   Node.js installed.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/crj-roadr/findr.git
    cd findr
    ```

2.  **Setup Server:**
    ```bash
    cd server
    npm install
    npm start
    ```
    The server runs on port 3000.

3.  **Setup Client:**
    Open a new terminal window.
    ```bash
    cd client
    npm install
    npm run dev
    ```
    The client runs on port 5173.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
