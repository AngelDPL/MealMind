from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, JSON, Integer, String
from typing import Optional

class UserPreference(db.Model):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    allergies: Mapped[list] = mapped_column(JSON, default=list)
    preferred_ingredients: Mapped[list] = mapped_column(JSON, default=list)
    max_calories_per_meal: Mapped[Optional[int]] = mapped_column(Integer)
    dietary_style: Mapped[Optional[str]] = mapped_column(String(50))

    user: Mapped["User"] = relationship(back_populates="preferences")

    def to_dict(self):
        return {
            "allergies": self.allergies,
            "preferred_ingredients": self.preferred_ingredients,
            "max_calories_per_meal": self.max_calories_per_meal,
            "dietary_style": self.dietary_style,
        }