Welcome to MoodTracker. This open-source platform is designed to help users track their moods, build healthy habits, and discover personalized wellness insights. Whether you are interested in contributing, using the application, or exploring its features, we hope you find MoodTracker valuable and easy to use.

MoodTracker integrates a modern React + Vite frontend with a robust Express/MongoDB backend, providing a comprehensive solution for mood and habit tracking.



## Features

- Log and visualize moods
- Build and track habits
- Daily challenges and motivational quotes
- Gamification: points, achievements, and streaks
- AI-powered mood assistant
- Resource recommendations
- User authentication
- Customizable themes



## Getting Started

To set up MoodTracker locally, please follow the steps below:



### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- MongoDB (local or cloud)



### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/luqmanbooso/MoodTracker.git
   cd MoodTracker
   ```

2. **Install dependencies for backend and frontend:**
   ```powershell
   cd server; npm install
   cd ../moodx; npm install
   ```

3. **Configure environment variables:**
   - Copy `server/.env.example` to `server/.env` and add your MongoDB URI and any required API keys.



### Running the Application

- **Start the backend:**
  ```powershell
  cd server; npm run dev
  ```
- **Start the frontend:**
  ```powershell
  cd moodx; npm run dev
  ```
- Open your browser to the local frontend URL (displayed in the terminal, e.g., http://localhost:5173/)



## Contributing

We welcome contributions from the community. Whether you are fixing a bug, adding a feature, or sharing ideas, your input is highly valued.

To contribute:

1. Fork this repository and create a new feature branch.
2. Make your changes, keeping commit messages clear and descriptive.
3. Follow the existing code style and add tests for any new features.
4. Document your changes so others can easily understand and use them.
5. When ready, submit a pull request and describe your improvements or additions.

For major changes or new features, please open an issue first to discuss your ideas with the maintainers.

We encourage respectful and constructive communication. All suggestions, feedback, and questions are welcome. Every contribution helps make MoodTracker a more positive and useful resource for everyone.



## License

MoodTracker is released under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for your interest in MoodTracker. We hope you find this project useful and enjoyable to use and contribute to.

---

Made with ❤️ by the MoodTracker community.