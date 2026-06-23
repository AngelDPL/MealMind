import { useState } from 'react'

const RecipeCard = ({ recipe, onDelete, lang }) => {
    const [showIngredients, setShowIngredients] = useState(false)

    return (
        <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition h-full ${showIngredients ? 'z-20' : 'z-0'} relative`}>

            <h3 className="font-bold text-black text-2xl">{recipe.name}.</h3>

            <div className="flex flex-col gap-3 flex-1">
                {recipe.description && (
                    <p className="text-gray-800 text-lg">// {recipe.description}.</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: `🔥 ${recipe.calories} kcal`, color: 'bg-orange-50 text-orange-600' },
                        { label: `💪 ${recipe.protein}g`, color: 'bg-blue-50 text-blue-600' },
                        { label: `🍞 ${recipe.carbs}g`, color: 'bg-yellow-50 text-yellow-600' },
                        { label: `🧈 ${recipe.fat}g`, color: 'bg-green-50 text-green-600' },
                    ].map((m, i) => (
                        <span key={i} className={`text-md font-medium px-2.5 py-1 rounded-full ${m.color}`}>
                            {m.label}
                        </span>
                    ))}
                </div>
            </div>

            {recipe.ingredients?.length > 0 && (
                <div className="relative">
                    <button
                        onClick={() => setShowIngredients(!showIngredients)}
                        className="text-indigo-500 font-medium text-md bg-transparent border-none shadow-none p-0 cursor-pointer"
                    >
                        {showIngredients ? '↓' : '→'} {lang === 'es' ? `Ingredientes (${recipe.ingredients.length})` : `Ingredients (${recipe.ingredients.length})`}
                    </button>
                    {showIngredients && (
                        <ul className="absolute z-50 bg-white rounded-xl shadow-lg p-3 flex flex-col gap-1 w-full mt-1 left-0">
                            {recipe.ingredients.map(ing => (
                                <li key={ing.id} className="text-gray-700 text-md">
                                    • {ing.name} — {ing.quantity} {ing.unit}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => onDelete(recipe.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-md font-medium py-2 rounded-xl transition border-none shadow-none"
                >
                    {lang === 'es' ? 'Eliminar' : 'Delete'}
                </button>
            </div>
        </div>
    )
}

export default RecipeCard