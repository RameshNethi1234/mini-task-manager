from pydantic import BaseModel, Field
from typing import Optional

# ---------- User Schemas ----------

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=255)

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True   # pydantic v2

# ---------- Token Schema (optional but nice for docs) ----------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- Task Schemas ----------

class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None

class TaskCreate(TaskBase):
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskOut(TaskBase):
    id: int
    completed: bool
    class Config:
        from_attributes = True
