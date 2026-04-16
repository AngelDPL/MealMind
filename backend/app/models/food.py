from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float
from typing import Optional

class Food(db.Model):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    name_en: Mapped[Optional[str]] = mapped_column(String(120))
    category: Mapped[Optional[str]] = mapped_column(String(60))
    category_en: Mapped[Optional[str]] = mapped_column(String(60))
    calories: Mapped[float] = mapped_column(default=0)
    protein: Mapped[float] = mapped_column(default=0)
    carbs: Mapped[float] = mapped_column(default=0)
    fat: Mapped[float] = mapped_column(default=0)
    unit: Mapped[str] = mapped_column(String(20), default='g')

    def to_dict(self, lang='es'):
        return {
            "id": self.id,
            "name": self.name_en if lang == 'en' and self.name_en else self.name,
            "category": self.category_en if lang == 'en' and self.category_en else self.category,
            "calories": self.calories,
            "protein": self.protein,
            "carbs": self.carbs,
            "fat": self.fat,
            "unit": self.unit
        }