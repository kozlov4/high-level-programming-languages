from datetime import date
from pydantic import BaseModel, ConfigDict


class CurrencyBase(BaseModel):
    code: str
    name: str
    model_config = ConfigDict(from_attributes=True)


class CurrencyGet(CurrencyBase):
    id: int


class CurrencySchema(CurrencyBase):
    pass


class CurrencyCreate(CurrencyBase):
    pass
