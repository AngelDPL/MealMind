from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Text, ForeignKey
from typing import Optional, List

class Ingredient(db.Model):
    __tablename__ = "ingredients"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[float] = mapped_column()
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))
    
    food = relationship("Food", lazy=True)
    
    
    @property
    def calories(self):
        return round(self.food.calories * self.quantity / 100, 1)
    
    @property
    def protein(self):
        return round(self.food.protein * self.quantity / 100, 1)
    
    @property
    def carbs(self):
        return round(self.food.carbs * self.quantity / 100, 1)
    
    @property
    def fat(self):
        return round(self.food.fat * self.quantity / 100, 1)
    
    def to_dict(self, lang='en'):
        return {
            "id": self.id,
            "food_id": self.food_id,
            "name": self.food.name_en if lang == 'en' and self.food.name_en else self.food.name,
            "quantity": self.quantity,
            "unit": self.food.unit,
            "calories": self.calories,
            "protein": self.protein,
            "carbs": self.carbs,
            "fat": self.fat
        }
        
        
class Recipe(db.Model):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    name_es: Mapped[Optional[str]] = mapped_column(String(120))
    description: Mapped[Optional[str]] = mapped_column(Text)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    description_es: Mapped[Optional[str]] = mapped_column(Text)

    ingredients = relationship("Ingredient", backref="recipe", lazy=True, cascade="all, delete-orphan")

    @property
    def calories(self):
        return round(sum(i.calories for i in self.ingredients), 1)

    @property
    def protein(self):
        return round(sum(i.protein for i in self.ingredients), 1)

    @property
    def carbs(self):
        return round(sum(i.carbs for i in self.ingredients), 1)

    @property
    def fat(self):
        return round(sum(i.fat for i in self.ingredients), 1)

    def to_dict(self, lang='en'):
        return {
            "id": self.id,
            "name": self.name_es if lang == 'es' and self.name_es else self.name,
            "name_es": self.name_es,
            "description": self.description_es if lang == 'es' and self.description_es else self.description,
            "description_es": self.description_es,
            "calories": self.calories,
            "protein": self.protein,
            "carbs": self.carbs,
            "fat": self.fat,
            "ingredients": [i.to_dict(lang=lang) for i in self.ingredients]
        }