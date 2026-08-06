from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chatbot_service import ask_chatbot

from app.database.database import get_db
from app.utils.jwt import verify_token
from app.models.user import User

router = APIRouter(
    prefix="/api/chat",
    tags=["Chatbot"],
)


@router.post("", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):

    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if payload is None:
        return ChatResponse(
            reply="Invalid Token"
        )

    user = db.query(User).filter(
        User.id == payload["user_id"]
    ).first()

    if not user:
        return ChatResponse(
            reply="User not found"
        )

    reply = ask_chatbot(
        request.message,
        user
    )

    return ChatResponse(
        reply=reply
    )