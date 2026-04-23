from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)

class Account(Base):
    __tablename__ = "accounts"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True) # e.g., "Cash", "HDFC Savings"
    category = Column(String(20)) # cash, savings, stocks
    balance = Column(Float, default=0.0)

class Expense(Base):
    __tablename__ = "expenses"

    user_id = Column(Integer, ForeignKey("users.id"))
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    amount = Column(Float)
    category = Column(String(50)) # Food, Travel, etc.
    date = Column(Date, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    type = Column(String(20), default="expense")