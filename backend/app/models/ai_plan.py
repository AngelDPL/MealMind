from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, JSON, DateTime, Integer
from typing import Optional
from datetime import datetime, timezone


class AIGeneratedPlan(db.Model):
    __tablename__ = "ai_generated_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    plan_data: Mapped[dict] = mapped_column(JSON)
    max_calories_per_meal: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="ai_plans")

    def to_dict(self):
        return {
            "id": self.id,
            "plan": self.plan_data,
            "max_calories_per_meal": self.max_calories_per_meal,
            "created_at": self.created_at.isoformat(),
        }