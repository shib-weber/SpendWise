import random
import jwt
from datetime import datetime, timedelta, date as date_type
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.security import OAuth2PasswordBearer

from . import crud, models, schemas, database

# --- CONFIGURATION ---
SECRET_KEY = "YOUR_SUPER_SECRET_KEY" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/verify")

# Initialize Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Personalized Expense Manager")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPERS ---
def get_current_user(db: Session = Depends(database.get_db), token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

otp_storage = {}

# --- AUTH ROUTES ---

@app.post("/auth/send-otp")
def send_otp(email: str):
    otp = str(random.randint(100000, 999999))
    otp_storage[email] = otp
    print(f"DEBUG: OTP for {email} is {otp}") 
    return {"message": "OTP sent successfully"}

@app.post("/auth/verify")
def verify_otp(email: str, otp: str, db: Session = Depends(database.get_db)):
    if otp_storage.get(email) != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user.email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": encoded_jwt, "token_type": "bearer"}

# --- ACCOUNTS ---

# --- ACCOUNTS ---

@app.get("/accounts/", response_model=List[schemas.Account])  # Added trailing slash for frontend match
def read_accounts(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Account).filter(models.Account.user_id == current_user.id).all()

@app.post("/accounts/", response_model=schemas.Account)
def create_account(account: schemas.AccountBase, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    db_account = models.Account(**account.dict(), user_id=current_user.id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@app.delete("/accounts/{account_id}")
def delete_account(
    account_id: int, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(database.get_db)
):
    # 1. Fetch account and verify it belongs to the current user
    account = db.query(models.Account).filter(
        models.Account.id == account_id, 
        models.Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found or access denied")
    
    # 2. Delete all expenses associated with this account first 
    # (If your SQLAlchemy model doesn't have cascade delete configured)
    db.query(models.Expense).filter(models.Expense.account_id == account_id).delete()
    
    # 3. Delete the account
    db.delete(account)
    db.commit()
    
    return {"message": "Account and all associated transactions deleted successfully"}

# --- EXPENSES ---
# (Rest of your expenses code remains the same)

# --- EXPENSES ---

@app.get("/expenses/{target_date}", response_model=List[schemas.Expense])
def read_expenses(target_date: date_type, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date == target_date
    ).all()

# --- EXPENSES ---

@app.post("/expenses", response_model=schemas.Expense)
def create_expense(expense: schemas.ExpenseCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # 1. Fetch the Account
    account = db.query(models.Account).filter(
        models.Account.id == expense.account_id, 
        models.Account.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Update Balance based on Type
    # Check if your schema/model has 'type'. If not, default to expense.
    transaction_type = getattr(expense, "type", "expense")
    
    if transaction_type == "income":
        account.balance += expense.amount
    else:
        account.balance -= expense.amount

    # 3. Save Record with user_id mapping
    db_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id, 
        models.Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # 1. Revert Balance (Inverse of the original action)
    account = db.query(models.Account).filter(models.Account.id == expense.account_id).first()
    if account:
        if expense.type == "income":
            account.balance -= expense.amount # Remove the income we added
        else:
            account.balance += expense.amount # Add back the expense we took away

    # 2. Delete Record
    db.delete(expense)
    db.commit()
    return {"message": "Transaction deleted and balance adjusted"}


@app.get("/expenses-all", response_model=List[schemas.Expense])
def read_all_expenses(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # This fetches every expense this user has ever recorded for the charts
    return db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()

