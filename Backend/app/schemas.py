from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- TOKEN SCHEMAS (For Auth) ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- EXPENSE SCHEMAS ---
class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: str
    date: date
    account_id: int
    type: str = "expense"

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    user_id: int  # Added this to show who owns the expense
    class Config:
        from_attributes = True

# --- ACCOUNT SCHEMAS ---
class AccountBase(BaseModel):
    name: str
    category: str
    balance: float

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    user_id: int # Added this to show who owns the account
    class Config:
        from_attributes = True