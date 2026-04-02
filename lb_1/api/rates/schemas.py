import datetime
from datetime import date
from pydantic import BaseModel, ConfigDict
from api.currency.schemas import CurrencySchema


class Rates(BaseModel):
    id: int
    buy_rate: float
    sell_rate: float
    date: date
    currency: CurrencySchema

    model_config = ConfigDict(from_attributes=True)


class RatesToday(Rates):
    pass


class BaseExchangeRates(BaseModel):
    currency_id: int
    buy_rate: float
    sell_rate: float
    date: date


class CreateNewExchange(BaseExchangeRates):
    pass
