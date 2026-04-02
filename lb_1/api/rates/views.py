from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import QueryableAttribute
from datetime import date
from . import crud
from .schemas import RatesToday, CreateNewExchange, BaseExchangeRates, Rates
from core.models import db_helper

router = APIRouter(tags=["Rates"], prefix="/rates")


@router.get("/today/", response_model=list[RatesToday])
async def get_rates_today(
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.get_rates_today(session=session)


@router.get("/archive/", response_model=list[Rates])
async def get_rates_archive(
    rate_date: Annotated[date | None, Query()] = None,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.get_rates_archive(session=session, target_date=rate_date)


@router.post("/", response_model=BaseExchangeRates, status_code=status.HTTP_201_CREATED)
async def create_new_exchange(
    exchange_in: CreateNewExchange,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.create_new_exchange(session=session, exchange_in=exchange_in)
