# Bragboard Admin Dashboard

A comprehensive, premium admin dashboard for managing the Bragboard platform. This application provides tools for user management, content moderation, analytics, and platform settings.

## Features

*   **User Management**: View, search, add, edit, and suspend users.
*   **Content Moderation**: Workflow to approve, reject, or review user shout-outs.
*   **Flagged Content**: Interface to review and remove flagged content.
*   **Analytics**: Visual insights into user engagement and platform activity.
*   **Authentication**: Secure Login, Signup, and Forgot Password flows with Google OAuth support.
*   **Settings**: Manage admin profile and platform security settings.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **Backend**: Python (Flask/FastAPI - *server folder*)
*   **Database & Auth**: Supabase
*   **Styling**: Custom "Premium" design system with Glassmorphism and animations.
*   **Icons**: Lucide React

## Project Structure

```
/
├── client/              # React Frontend Application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── layout/      # Sidebar, Navbar, PageContainer
│   │   ├── pages/       # Dashboard pages (Users, Moderation, etc.)
│   │   └── ...
├── server/              # Python Backend Application
├── supabase/            # Database configurations
└── ...
```

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   Python (3.7+)
*   Supabase Account

### Client Setup (Frontend)

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env` file in the `client` directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

### Server Setup (Backend)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Run the server:
    ```bash
    python main.py
    ```

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License.
