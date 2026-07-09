from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from typing import Optional
import secrets


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True)
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    first_login: Mapped[bool] = mapped_column(default=True)

    pending_email: Mapped[Optional[str]] = mapped_column(String(120))
    email_confirm_token: Mapped[Optional[str]] = mapped_column(String(100))
    password_reset_token: Mapped[Optional[str]] = mapped_column(String(100))

    subscription: Mapped[Optional["Subscription"]] = relationship(back_populates="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_email_token(self):
        self.email_confirm_token = secrets.token_urlsafe(32)
        return self.email_confirm_token

    def generate_reset_token(self):
        self.password_reset_token = secrets.token_urlsafe(32)
        return self.password_reset_token

    @property
    def is_premium(self):
        return self.subscription is not None and self.subscription.is_active

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_login": self.first_login,
            "is_premium": self.is_premium,
        }
