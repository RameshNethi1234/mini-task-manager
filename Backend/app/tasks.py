from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.utils import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).all()
    return tasks

@router.post("/", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=current_user.id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(
    task_id: int,
    payload: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id, models.Task.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    # Update only provided fields
    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.completed is not None:
        task.completed = payload.completed

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id, models.Task.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    db.delete(task)
    db.commit()
    return
