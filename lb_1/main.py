import uvicorn
from sqladmin import Admin, ModelView
from core.models import Currency, ExchangeRate
from core.models import db_helper
from fastapi import FastAPI
from api.rates.views import router as rates_router
from api.currency.views import router as currencies_router
from fastapi.middleware.cors import CORSMiddleware
from api.router_page import router as pages_router

app = FastAPI()
app.include_router(rates_router)
app.include_router(currencies_router)
app.include_router(pages_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


admin = Admin(app, db_helper.engine)


class CurrencyAdmin(ModelView, model=Currency):
    column_list = [Currency.id, Currency.code, Currency.name]


class RateAdmin(ModelView, model=ExchangeRate):
    column_list = [
        ExchangeRate.id,
        ExchangeRate.currency_id,
        ExchangeRate.buy_rate,
        ExchangeRate.sell_rate,
        ExchangeRate.date,
    ]


admin.add_view(CurrencyAdmin)
admin.add_view(RateAdmin)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
