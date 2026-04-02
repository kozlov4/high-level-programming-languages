from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

templates = Jinja2Templates(directory="api/templates")
router = APIRouter(tags=["Frontend"])


@router.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@router.get("/archive", response_class=HTMLResponse)
async def archive_page(request: Request):
    return templates.TemplateResponse(request=request, name="archieve.html")
