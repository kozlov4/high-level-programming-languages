from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import QueryableAttribute
from datetime import date
from . import crud
from .schemas import CurrencyCreate, CurrencyBase, CurrencyGet
from core.models import db_helper

router = APIRouter(tags=["Currency"], prefix="/currencies")


@router.get("/", response_model=list[CurrencyGet])
async def get_all_currencies(
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.get_all_currencies(session=session)


@router.post("/", response_model=CurrencyBase, status_code=status.HTTP_201_CREATED)
async def create_new_currency(
    currency_in: CurrencyCreate,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.create_new_currency(session=session, currency_in=currency_in)
