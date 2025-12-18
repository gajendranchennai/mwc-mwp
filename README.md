# My Wedding Planner 💍

A modern, all-in-one smart wedding planning application built with React, Tailwind CSS, and Google Gemini AI.

## ✨ Features

- **Dashboard**: Real-time overview of budget, guests, and tasks.
- **Smart Budget Tracker**: AI-powered budget breakdown based on your total budget and location.
- **Guest List Management**: Track RSVPs, meal preferences, and generate PDF reports.
- **Interactive Checklist**: Pre-populated wedding tasks with categorization.
- **Event Timeline**: Drag-and-drop style timeline management for the big day.
- **Bella AI Assistant**: A personalized AI wedding planner to answer etiquette questions and write vows.
- **Inspiration Generator**: Generate visual ideas for cakes, dresses, and decor using AI.
- **PDF Reports**: Export professional-grade PDF reports for all sections.
- **Data Backup**: Download your entire planning data as a ZIP file.

## 🚀 Getting Started

This project is built using **ES Modules** directly in the browser, requiring no build step (like Webpack or Vite) to run in development. Dependencies are loaded via CDN (`esm.sh`).

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari).
- A local web server (e.g., Live Server for VS Code, `python -m http.server`, or `npx serve`).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/my-wedding-planner.git
    ```
2.  **Navigate to the project folder**:
    ```bash
    cd my-wedding-planner
    ```
3.  **Set up API Key**:
    - Create a `.env` file (if you decide to move to a build process) or ensure your environment injects `process.env.API_KEY` for the Google Gemini API.
    - *Note: In this browser-native demo, the API key is expected to be handled by the hosting environment.*

### Running Locally

Since this uses native ES modules, you cannot simply open `index.html` file directly in the browser due to CORS policies. You must serve it.

**Using Python:**
```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

**Using Node.js (npx):**
```bash
npx serve .
# Open the URL provided in the terminal
```

## 🛠️ Technologies Used

- **React 18**: UI Library (via ESM).
- **Tailwind CSS**: Styling (via CDN).
- **Google GenAI SDK**: AI features (Gemini 2.5 Flash).
- **Recharts**: Data visualization.
- **jsPDF & AutoTable**: PDF generation.
- **Lucide React**: Iconography.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
