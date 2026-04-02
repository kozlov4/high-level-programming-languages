from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import ExchangeRate, Currency
from sqlalchemy.engine import Result
from .schemas import CurrencyBase, CurrencyCreate, CurrencyGet
from sqlalchemy.orm import joinedload


async def get_all_currencies(session: AsyncSession) -> list[CurrencyGet]:
    stmt = select(Currency)
    result: Result = await session.execute(stmt)
    currencies = result.scalars().all()
    return list(currencies)


async def create_new_currency(
    session: AsyncSession,
    currency_in: CurrencyCreate,
) -> Currency:
    currency = Currency(**currency_in.model_dump())
    session.add(currency)
    await session.commit()
    return currency
