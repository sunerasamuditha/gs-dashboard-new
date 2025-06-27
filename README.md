# GS-Dashboard 🇱🇰

<p align="center">
<img src="./images/collage.jpg" alt="Project Screenshot" width="800"/>
</p>

<p align="center">
<strong>A stunning and interactive web application for visualizing data about Sri Lanka.</strong>
<br />
Dive into a beautiful 3D map of the island, explore detailed district-level statistics, and gain insights through dynamic charts and visualizations.
<br />
<br />
<a href="https://github.com/your_username/gs-dashboard-new/issues">Report Bug</a>
·
<a href="https://github.com/your_username/gs-dashboard-new/issues">Request Feature</a>
</p>

<p align="center">
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
<img src="https://img.shields.io/badge/react-^18.2.0-blue" alt="React">
<img src="https://img.shields.io/badge/three.js-^0.173.0-orange" alt="Three.js">
<img src="https://img.shields.io/badge/chart.js-^4.4.7-red" alt="Chart.js">
<img src="https://img.shields.io/badge/bootstrap-^5.3.3-purple" alt="Bootstrap">
</p>

Welcome to the GS-Dashboard, a modern, responsive, and user-friendly platform for data exploration in Sri Lanka.

-----

## ✨ Features

  - **Interactive 3D Map:** A high-fidelity 3D model of Sri Lanka, built with React Three Fiber, providing an immersive experience.
  - **Detailed Data Visualization:** In-depth charts and panels for district-level data using Chart.js and Recharts to bring statistics to life.
  - **National Statistics:** Get a bird's-eye view of the entire country's data for a comprehensive understanding.
  - **Responsive Design:** A seamless and intuitive experience across all devices, from mobile phones to desktops.
  - **Modern UI/UX:** Beautifully designed components with smooth, fluid animations powered by Framer Motion.

-----

## 🛠️ Tech Stack

This project is built with a modern and powerful tech stack to deliver a high-performance, visually stunning application.

| Category          | Technologies                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [React](https://reactjs.org/), [React Router](https://reactrouter.com/)                                                                                                                                    |
| **3D Rendering** | [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction), [@react-three/drei](https://github.com/pmndrs/drei)                              |
| **Charting** | [Chart.js](https://www.chartjs.org/), [Recharts](https://recharts.org/en-US/)                                                                                                                            |
| **Styling** | [Bootstrap](https://getbootstrap.com/), [React-Bootstrap](https://react-bootstrap.github.io/), CSS3                                                                                                      |
| **Animation** | [Framer Motion](https://www.framer.com/motion/)                                                                                                                                                         |

-----

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have Node.js and npm installed on your machine. You can download them from [https://nodejs.org/](https://nodejs.org/).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/gs-dashboard-new.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd gs-dashboard-new
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Usage

  * **To run the app in development mode:**

    ```sh
    npm start
    ```

    Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will automatically reload when you make changes.

  * **To build the app for production:**

    ```sh
    npm run build
    ```

    This command bundles React in production mode and optimizes the build for the best performance. The output will be in the `build` folder.

-----

## 📂 Project Structure

The project follows a modular and organized folder structure to ensure maintainability and scalability.

```
gs-dashboard-new/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── DistrictChart.js
│   │   ├── DistrictDetailPanel.js
│   │   ├── DistrictMap.js
│   │   ├── NationalStats.js
│   │   ├── Navbar.js
│   │   ├── OceanWaves.js
│   │   ├── SriLankaMap.js
│   │   └── SummaryChart.js
│   ├── hooks/
│   │   ├── useResponsive.js
│   │   └── useDistrictData.js
│   ├── images/
│   ├── pages/
│   │   ├── About.js
│   │   ├── Home.js
│   │   └── MapSection.js
│   ├── utils/
│   │   └── responsive.js
│   ├── App.js
│   ├── index.js
│   └── ...
├── package.json
└── README.md
```

### Key Directories

  - **`public/`**: Contains public assets and the main `index.html` file.
  - **`src/`**: The heart of the application, containing all the source code.
      - **`components/`**: Reusable React components that form the building blocks of the UI.
      - **`hooks/`**: Custom React hooks for managing state and side effects.
      - **`pages/`**: The main pages of the application.
      - **`utils/`**: Utility functions that can be used across the application.

-----

## 📜 Available Scripts

In the project directory, you can run the following scripts:

  - `npm start`: Runs the app in development mode.
  - `npm run build`: Builds the app for production.
  - `npm test`: Launches the test runner in interactive watch mode.
  - `npm run eject`: Removes the single dependency from your project (Note: this is a one-way operation).

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

To contribute:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

We appreciate your support in making this project even better\!

-----

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

-----

## 📧 Contact

Your Name - your\_email@example.com

Project Link: [https://github.com/your\_username/gs-dashboard-new](https://github.com/your_username/gs-dashboard-new)