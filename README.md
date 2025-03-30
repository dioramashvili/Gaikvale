# Gaikvale
# EchoWave Marketing Dashboard

This project is a marketing dashboard designed to assist users in strategizing and evaluating marketing campaigns for the EchoWave event. It features AI-powered feedback to enhance decision-making in various marketing tasks.

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Setup and Installation](#setup-and-installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [License](#license)

## Project Overview

The EchoWave Marketing Dashboard provides a platform for users to:

-   Evaluate social media posts.
-   Make sponsorship decisions.
-   Manage crisis communication.
-   Plan and analyze digital advertising campaigns.

The application uses Google's Gemini Pro AI to provide insightful and constructive feedback on user inputs, helping to refine marketing strategies.

## Features

-   **Social Media Post Evaluation:** Users can submit social media posts for AI-driven analysis and feedback.
-   **Sponsorship Decision Support:** Provides scenarios and AI feedback to help users make informed sponsorship choices.
-   **Crisis Management Simulation:** Allows users to evaluate crisis communication strategies and damage control plans.
-   **Digital Advertising Campaign Planning:** Users can plan and analyze digital ad campaigns, receiving feedback on audience targeting and budget allocation.
-   **User-friendly Interface:** Intuitive design for easy navigation and interaction.
-   **AI-Powered Feedback:** Leverages Gemini Pro AI to provide detailed and relevant feedback.

## Technologies Used

-   **Frontend:**
    -   HTML
    -   CSS
    -   JavaScript
-   **Backend:**
    -   Node.js
    -   Express.js
    -   Google Cloud Vertex AI (`@google-cloud/vertexai`)
    -   `body-parser`
    -   `cors`
-   **AI:**
    -   Google Gemini Pro

## Setup and Installation

1.  **Clone the Repository:**

    ```bash
    git clone [repository URL]
    cd [project directory]
    ```

2.  **Backend Setup:**

    -   Navigate to the `backend` directory.
    -   Install Node.js dependencies:

    ```bash
    npm install
    ```

    -   Create a Google Cloud service account and download the JSON credentials file.
    -   Place the credentials file in the `backend` directory.
    -   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your credentials file.
    -   Start the backend server:

    ```bash
    npm start
    ```

3.  **Frontend Setup:**

    -   Navigate to the `frontend` directory.
    -   Open `index.html` (or `task1.html`, `task2.html`, etc.) in your web browser.
    -   If hosting the backend on a different domain or port, update the `fetch` URLs in the JavaScript files to point to your backend's URL.

## Usage

1.  **Start the Backend:** Ensure your Node.js backend server is running.
2.  **Open the Frontend:** Open the HTML files in your web browser.
3.  **Interact with the Dashboard:**
    -   Use the input fields and buttons to submit data for evaluation.
    -   View the AI-generated feedback in the designated feedback sections.
    -   Navigate between tasks using the provided links or buttons.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).