from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone, timedelta


class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    stripe_customer_id: Mapped[Optional[str]] = mapped_column(String(120))
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(String(120))

    status: Mapped[str] = mapped_column(String(30), default="none")

    trial_end: Mapped[Optional[datetime]] = mapped_column(DateTime)
    current_period_end: Mapped[Optional[datetime]] = mapped_column(DateTime)
    past_due_since: Mapped[Optional[datetime]] = mapped_column(DateTime)

    user: Mapped["User"] = relationship(back_populates="subscription")

    GRACE_PERIOD_DAYS = 3

    @property
    def is_active(self):
        if self.status in ("active", "trialing"):
            return True
        if self.status == "past_due" and self.past_due_since:
            grace_deadline = self.past_due_since + timedelta(days=self.GRACE_PERIOD_DAYS)
            return datetime.now(timezone.utc) < grace_deadline.replace(tzinfo=timezone.utc)
        return False

    def to_dict(self):
        return {
            "status": self.status,
            "trial_end": self.trial_end.isoformat() if self.trial_end else None,
            "current_period_end": self.current_period_end.isoformat() if self.current_period_end else None,
            "is_active": self.is_active,
        }