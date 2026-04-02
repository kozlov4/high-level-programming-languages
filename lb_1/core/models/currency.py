from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text

from .base import Base

if TYPE_CHECKING:
    from .exchange_rate import ExchangeRate


class Currency(Base):
    code: Mapped[str] = mapped_column(String(6))
    name: Mapped[str] = mapped_column(String(32))

    exchange_rates: Mapped[list["ExchangeRate"]] = relationship(
        back_populates="currency",
        cascade="all, delete-orphan",
    )
