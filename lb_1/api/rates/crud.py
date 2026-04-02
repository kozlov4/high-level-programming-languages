from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import ExchangeRate, Currency
from sqlalchemy.engine import Result
from .schemas import RatesToday, BaseExchangeRates, CreateNewExchange, Rates
from sqlalchemy.orm import joinedload


async def get_rates_today(session: AsyncSession) -> list[RatesToday]:
    stmt = (
        select(ExchangeRate)
        .options(joinedload(ExchangeRate.currency))
        .where(ExchangeRate.date == date.today())
    )
    result: Result = await session.execute(stmt)
    rates = result.scalars().all()
    return list(rates)


async def get_rates_archive(
    session: AsyncSession,
    target_date: date | None = None,
) -> list[Rates]:
    stmt = (
        select(ExchangeRate)
        .options(joinedload(ExchangeRate.currency))
        .where(ExchangeRate.date == target_date)
    )
    result: Result = await session.execute(stmt)
    rates = result.scalars().all()
    return list(rates)


async def create_new_exchange(
    session: AsyncSession,
    exchange_in: CreateNewExchange,
) -> ExchangeRate:
    exchange = ExchangeRate(**exchange_in.model_dump())
    session.add(exchange)
    await session.commit()
    return exchange
