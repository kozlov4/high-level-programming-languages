import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from .base import Base


class ExchangeRate(Base):
    currency_id: Mapped[int] = mapped_column(ForeignKey("currency.id"))

    buy_rate: Mapped[float] = mapped_column()
    sell_rate: Mapped[float] = mapped_column()
    date: Mapped[datetime.date] = mapped_column()

    currency: Mapped["Currency"] = relationship(back_populates="exchange_rates")
