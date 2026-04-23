from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import crud, schemas, database, models
# Ensure get_current_user is imported correctly from your auth/main setup
from ..main import get_current_user 

router = APIRouter(
    prefix="/expenses",
    tags=["expenses"]
)

@router.get("/{target_date}", response_model=List[schemas.Expense])
def read_expenses(
    target_date: date, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_expenses_by_date(db, target_date, user_id=current_user.id)

@router.post("/", response_model=schemas.Expense)
def create_expense(
    expense: schemas.ExpenseCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # crud.create_expense will now handle balance adjustment 
    # based on expense.type (income vs expense)
    return crud.create_expense(db, expense=expense, user_id=current_user.id)

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # crud.delete_expense will now accurately reverse the balance
    success = crud.delete_expense(db, expense_id=expense_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found or unauthorized")
    return {"message": "Transaction deleted and balance adjusted"}