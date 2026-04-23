from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

# --- Account Logic ---

def get_accounts(db: Session, user_id: int):
    return db.query(models.Account).filter(models.Account.user_id == user_id).all()

def create_account(db: Session, account: schemas.AccountCreate, user_id: int):
    db_account = models.Account(**account.dict(), user_id=user_id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

# --- Expense/Income Logic ---

def get_expenses_by_date(db: Session, target_date: date, user_id: int):
    return db.query(models.Expense).filter(
        models.Expense.date == target_date,
        models.Expense.user_id == user_id
    ).all()

def create_expense(db: Session, expense: schemas.ExpenseCreate, user_id: int):
    # 1. Initialize the record object
    db_expense = models.Expense(**expense.dict(), user_id=user_id)
    db.add(db_expense)
    
    # 2. Update Account Balance based on type
    account = db.query(models.Account).filter(
        models.Account.id == expense.account_id,
        models.Account.user_id == user_id
    ).first()
    
    if account:
        # If type is income, we add to balance. Otherwise, we subtract.
        if getattr(expense, 'type', 'expense') == 'income':
            account.balance += expense.amount
        else:
            account.balance -= expense.amount
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int, user_id: int):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == user_id
    ).first()
    
    if expense:
        # Find the linked account
        account = db.query(models.Account).filter(
            models.Account.id == expense.account_id,
            models.Account.user_id == user_id
        ).first()
        
        if account:
            # REVERSE the previous action
            # If it was income, we must remove it from the balance.
            # If it was an expense, we must add it back.
            if expense.type == 'income':
                account.balance -= expense.amount
            else:
                account.balance += expense.amount
            
        db.delete(expense)
        db.commit()
        return True
    return False