# KhwopaCoder - College Coding Leaderboard

KhwopaCoder is a full-stack application for a college coding leaderboard platform. Students can solve coding challenges, compete with peers, and track their progress.

## Project Structure

\`\`\`
khwopacoder/
├── frontend/         # Next.js frontend application
├── backend/          # FastAPI backend application
├── docker-compose.yml
└── README.md
\`\`\`

## Features

- User authentication and profile management
- Coding challenges with different difficulty levels
- Real-time code execution and testing
- Leaderboard to track student rankings
- Badges and achievements system
- Activity tracking
- User settings and preferences

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Context API for state management

### Backend
- FastAPI (Python)
- PostgreSQL database
- JWT authentication
- Code execution service

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker Compose (Recommended)

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/khwopacoder.git
   cd khwopacoder
   \`\`\`

2. Create environment files:
   \`\`\`bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   \`\`\`

3. Start the application:
   \`\`\`bash
   docker-compose up
   \`\`\`

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database connection string and other settings
   \`\`\`

5. Start the backend server:
   \`\`\`bash
   uvicorn main:app --reload
   \`\`\`

#### Frontend

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your API URL
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Schema

The application uses PostgreSQL. The main entities are:

- User: Student information and statistics
- Challenge: Coding problems with test cases
- Submission: User solutions to challenges
- Badge: Achievements that users can earn
- Activity: User actions and events

## API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
