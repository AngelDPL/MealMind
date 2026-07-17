import { useState } from 'react'

const MACRO_CONFIG = [
    { key: 'calories', suffix: ' kcal', icon: '🔥', color: 'text-orange-400' },
    { key: 'protein', suffix: 'g', icon: '🌿', color: 'text-emerald-400' },
    { key: 'carbs', suffix: 'g', icon: '⚡', color: 'text-blue-400' },
    { key: 'fat', suffix: 'g', icon: '💧', color: 'text-purple-400' },
]

const RecipeCard = ({ recipe, onDelete, lang }) => {
    const [showIngredients, setShowIngredients] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleConfirm = () => {
        setConfirmDelete(false)
        onDelete(recipe.id)
    }

    const photographerLink = recipe.image_photographer_url
        ? recipe.image_photographer_url + '?utm_source=mealmind&utm_medium=referral'
        : '#'

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-neutral-700 transition h-full">

            <div className="relative h-40 bg-neutral-800">
                {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                )}
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-red-500/80 backdrop-blur-sm text-white flex items-center justify-center text-sm transition border-none shadow-none"
                    aria-label={lang === 'es' ? 'Eliminar' : 'Delete'}
                >
                    ✕
                </button>
                {recipe.image_url && recipe.image_photographer_name ? (
                    <a
                        href={photographerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-1.5 right-2 text-[10px] text-white/70 hover:text-white bg-black/40 px-1.5 py-0.5 rounded no-underline transition"
                    >
                        {lang === 'es' ? 'Foto de' : 'Photo by'} {recipe.image_photographer_name} / <span className="underline">Unsplash</span>
                    </a>
                ) : null}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{recipe.name}</h3>
                    {recipe.description && (
                        <p className="text-neutral-400 text-sm mt-0.5 line-clamp-2">{recipe.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {MACRO_CONFIG.map(m => (
                        <div key={m.key} className="flex items-center gap-1.5 bg-neutral-800/60 rounded-lg px-2.5 py-1.5">
                            <span className={`text-sm ${m.color}`}>{m.icon}</span>
                            <span className="text-white text-xs font-semibold">
                                {recipe[m.key]}{m.suffix}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="text-neutral-500 text-xs">
                        {lang === 'es' ? 'Ingredientes' : 'Ingredients'} ({recipe.ingredients?.length || 0})
                    </span>
                    <button
                        onClick={() => setShowIngredients(!showIngredients)}
                        className="text-orange-400 hover:text-orange-300 border border-orange-500/40 hover:border-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition bg-transparent shadow-none"
                    >
                        {showIngredients
                            ? (lang === 'es' ? 'Ocultar' : 'Hide')
                            : (lang === 'es' ? 'Ver receta' : 'View recipe')}
                    </button>
                </div>

                {showIngredients && recipe.ingredients?.length > 0 && (
                    <ul className="flex flex-col gap-1 pt-2 border-t border-neutral-800">
                        {recipe.ingredients.map(ing => (
                            <li key={ing.id} className="text-neutral-400 text-xs">
                                • {ing.name} — {ing.quantity} {ing.unit}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {lang === 'es' ? '¿Eliminar esta receta?' : 'Delete this recipe?'}
                        </h3>
                        <p className="text-gray-500 text-sm">{recipe.name}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition border-none"
                            >
                                {lang === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                            >
                                {lang === 'es' ? 'Eliminar' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipeCard