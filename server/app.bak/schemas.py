# server/app/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

# --- Enums ---

class UserType(str, Enum):
    user = "user"
    admin = "admin"
    moderator = "moderator"

# --- Auth / User schemas ---

class LoginIn(BaseModel):
    email: str        # accepts .local addresses (keeps lenient)
    password: str

class UserCreate(BaseModel):
    username: str
    full_name: str
    user_type: Optional[UserType] = UserType.user
    email: str
    password: str
    department: Optional[str] = None

class UserOut(BaseModel):
    user_id: int
    username: str
    full_name: str
    user_type: UserType
    email: str
    department: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None

class AdminCreateUser(BaseModel):
    username: str
    full_name: str
    user_type: UserType
    email: str
    password: str
    department: Optional[str] = None

# --- Posts / Tags / Reactions / Comments ---

class PostCreate(BaseModel):
    description: Optional[str] = None
    image_url: Optional[str] = None
    recipients: Optional[List[int]] = []  # list of user_id to tag/notify

class PostOut(BaseModel):
    post_id: int
    user_id: int
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: str

class PostTagOut(BaseModel):
    post_tag_id: int
    post_id: int
    user_id: int

class ReactionCreate(BaseModel):
    post_id: int
    reaction_type: str

class ReactionOut(BaseModel):
    reaction_id: int
    post_id: int
    user_id: int
    reaction_type: str
    created_at: str

class CommentCreate(BaseModel):
    post_id: int
    content: str

class CommentOut(BaseModel):
    comment_id: int
    post_id: int
    user_id: int
    content: str
    created_at: str

# --- Reports / Notifications ---

class ReportedPostCreate(BaseModel):
    post_id: int
    report_reason: Optional[str] = None

class NotificationOut(BaseModel):
    notification_id: int
    user_id: int
    type: str
    content: str
    is_read: bool
    created_at: str

# --- Analytics / Misc ---

class HTTPValidationError(BaseModel):
    detail: Optional[List[dict]] = None

# If you add other schemas in code, declare them here.
