from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database, models
# Import the dependency we created in main.py
from ..main import get_current_user 

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"]
)

@router.get("/", response_model=List[schemas.Account])
def read_accounts(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user) # Protects the route
):
    # Pass current_user.id to the CRUD function
    return crud.get_accounts(db, user_id=current_user.id)

@router.post("/", response_model=schemas.Account)
def create_account(
    account: schemas.AccountCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user) # Protects the route
):
    # Pass current_user.id to create the link in DB
    return crud.create_account(db, account=account, user_id=current_user.id)