# BragBoard Admin Backend (FastAPI)

This is the FastAPI backend for the BragBoard Admin Dashboard.

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Backend

### Development Mode
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### API Documentation
Once running, access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/signup` - Admin signup

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{user_id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Shout-out Moderation
- `GET /api/shoutouts` - Get all shout-outs (optional `?status=` filter)
- `PUT /api/shoutouts/{shoutout_id}/approve` - Approve a shout-out
- `PUT /api/shoutouts/{shoutout_id}/reject` - Reject a shout-out

### Flagged Content
- `GET /api/flagged` - Get all flagged content
- `PUT /api/flagged/{item_id}/resolve` - Resolve flagged content

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/user-growth` - Get user growth data
- `GET /api/analytics/engagement` - Get engagement metrics

## Environment Configuration

For production, create a `.env` file with:
```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Next Steps

1. **Database Integration**: Replace mock data with actual database (PostgreSQL, MySQL, etc.)
2. **Authentication**: Implement JWT tokens with proper password hashing (bcrypt)
3. **Validation**: Add comprehensive input validation and error handling
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to a production server (AWS, Heroku, etc.)

## Notes

- This is a starter template with mock data
- No database is currently configured
- Authentication uses mock tokens
- Replace all TODO comments with actual implementations
