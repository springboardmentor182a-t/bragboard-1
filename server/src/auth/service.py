from fastapi import HTTPException

# TEMPORARY mock user for development
# Replace with real JWT auth later
def get_current_user():
    """
    This temporary function simulates a logged-in user.
    Change the role to 'admin' or 'employee' for testing.
    """

    # FOR TESTING — behaves like an admin
    return {
        "id": 1,
        "name": "Test Admin",
        "role": "admin"
    }

    # If you want to test employee:
    # return {
    #     "id": 5,
    #     "name": "Test User",
    #     "role": "employee"
    # }
