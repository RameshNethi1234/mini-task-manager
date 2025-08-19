from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth, tasks, models
from app.database import Base, engine

# Create DB tables on startup (simple for this assignment)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini Task Manager")

# CORS (adjust allow_origins for your frontend URL in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
def root():
    return {"message": "Mini Task Manager API is running"}
