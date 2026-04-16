import { useState, useEffect } from 'react'
import { getRecipes, createRecipe, deleteRecipe } from '../../services/recipeService'
import { useAuth } from '../../context/AuthContext'
import FoodSearch from '../../components/ui/FoodSearch'

const Recipes = () => {

    const [form, setForm] = useState({ name: '', description: '' })
    const [ingredients, setIngredients] = useState([])
    const [pendingIngredient, setPendingIngredient] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const { firstLogin, setFirstLogin, user } = useAuth()

    useEffect(() => {
        fetchRecipes()
    }, [])

    const fetchRecipes = async () => {
        try {
            const data = await getRecipes()
            setRecipes(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteRecipe(id)
            fetchRecipes()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleFoodSelect = (food) => {
        setPendingIngredient({ food, quantity: '' })
    }

    const handleAddIngredient = () => {
        if (!pendingIngredient || !pendingIngredient.quantity) return
        setIngredients([...ingredients, {
            food_id: pendingIngredient.food.id,
            food_name: pendingIngredient.food.name,
            quantity: parseFloat(pendingIngredient.quantity),
            unit: pendingIngredient.food.unit,
            calories: parseFloat((pendingIngredient.food.calories * pendingIngredient.quantity / 100).toFixed(1)),
            protein: parseFloat((pendingIngredient.food.protein * pendingIngredient.quantity / 100).toFixed(1)),
            carbs: parseFloat((pendingIngredient.food.carbs * pendingIngredient.quantity / 100).toFixed(1)),
            fat: parseFloat((pendingIngredient.food.fat * pendingIngredient.quantity / 100).toFixed(1)),
        }])
        setPendingIngredient(null)
    }

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createRecipe({
                name: form.name,
                description: form.description,
                ingredients: ingredients.map(i => ({
                    food_id: i.food_id,
                    quantity: i.quantity
                }))
            })
            setForm({ name: '', description: '' })
            setIngredients([])
            setShowForm(false)
            fetchRecipes()
        } catch (err) {
            setError(err.message)
        }
    }

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* Welcome modal */}
            {firstLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                        <div className="text-5xl">👋</div>
                        <h3 className="text-xl font-bold text-gray-800">Welcome, {user.username}!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We've added <span className="font-semibold text-indigo-600">20 recipes</span> to get you started with macros already calculated.
                        </p>
                        <div className="bg-indigo-50 rounded-xl px-4 py-3">
                            <span className="text-2xl">🍽️</span>
                            <p className="text-indigo-600 text-sm font-medium mt-1">Start planning your weekly menu!</p>
                        </div>
                        <button
                            onClick={() => setFirstLogin(false)}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Let's go! 🚀
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white drop-shadow">🍽️ My Recipes</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 border-none shadow-md ${showForm
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        }`}
                >
                    {showForm ? '✕ Cancel' : '+ New recipe'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    ⚠️ {error}
                </div>
            )}

            {/* Formulario */}
            {showForm && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">New recipe</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Recipe name</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Chicken with rice"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Description (optional)</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Brief description..."
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredients</label>
                            <FoodSearch onSelect={handleFoodSelect} />
                        </div>

                        {pendingIngredient && (
                            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl">
                                <span className="text-sm font-medium text-gray-700 flex-1">
                                    {pendingIngredient.food.name}
                                </span>
                                <input
                                    type="number"
                                    placeholder={`Amount (${pendingIngredient.food.unit})`}
                                    value={pendingIngredient.quantity}
                                    onChange={e => setPendingIngredient({ ...pendingIngredient, quantity: e.target.value })}
                                    className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-400 transition"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition border-none"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPendingIngredient(null)}
                                    className="text-gray-400 hover:text-red-500 bg-transparent border-none shadow-none p-0"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {ingredients.length > 0 && (
                            <ul className="flex flex-col gap-1">
                                {ingredients.map((ing, i) => (
                                    <li key={i} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-400">🥄</span>
                                            <span className="font-medium text-gray-700">{ing.food_name}</span>
                                            <span className="text-gray-400">—</span>
                                            <span className="text-indigo-600 font-semibold">{ing.quantity} {ing.unit}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400">🔥 {ing.calories} kcal</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(i)}
                                                className="text-red-400 hover:text-red-600 bg-transparent border-none shadow-none p-0 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {ingredients.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'Calories', value: `${ingredients.reduce((a, i) => a + i.calories, 0).toFixed(1)} kcal`, color: 'bg-orange-50 text-orange-600' },
                                    { label: 'Protein', value: `${ingredients.reduce((a, i) => a + i.protein, 0).toFixed(1)}g`, color: 'bg-blue-50 text-blue-600' },
                                    { label: 'Carbs', value: `${ingredients.reduce((a, i) => a + i.carbs, 0).toFixed(1)}g`, color: 'bg-yellow-50 text-yellow-600' },
                                    { label: 'Fat', value: `${ingredients.reduce((a, i) => a + i.fat, 0).toFixed(1)}g`, color: 'bg-green-50 text-green-600' },
                                ].map((m, i) => (
                                    <div key={i} className={`text-center py-2 px-3 rounded-xl ${m.color}`}>
                                        <p className="text-xs font-bold">{m.value}</p>
                                        <p className="text-xs opacity-70">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Save recipe
                        </button>
                    </form>
                </div>
            )}

            {/* Buscador de recetas */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search recipes..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border-none bg-white/20 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition text-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none shadow-none p-0 text-sm"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Grid de recetas */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white/80 text-sm">Loading recipes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecipes.length === 0 && (
                        <div className="col-span-full text-center py-16 text-white/70">
                            {search ? `No recipes found for "${search}"` : 'No recipes yet. Create your first one!'}
                        </div>
                    )}
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition">
                            <h3 className="font-bold text-gray-800 text-lg">{recipe.name}</h3>
                            {recipe.description && (
                                <p className="text-gray-500 text-sm">{recipe.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: `🔥 ${recipe.calories} kcal`, color: 'bg-orange-50 text-orange-600' },
                                    { label: `💪 ${recipe.protein}g`, color: 'bg-blue-50 text-blue-600' },
                                    { label: `🍞 ${recipe.carbs}g`, color: 'bg-yellow-50 text-yellow-600' },
                                    { label: `🧈 ${recipe.fat}g`, color: 'bg-green-50 text-green-600' },
                                ].map((m, i) => (
                                    <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.color}`}>
                                        {m.label}
                                    </span>
                                ))}
                            </div>
                            {recipe.ingredients?.length > 0 && (
                                <details className="text-sm">
                                    <summary className="cursor-pointer text-indigo-500 font-medium">
                                        Ingredients ({recipe.ingredients.length})
                                    </summary>
                                    <ul className="mt-2 flex flex-col gap-1">
                                        {recipe.ingredients.map(ing => (
                                            <li key={ing.id} className="text-gray-500 text-xs">
                                                • {ing.name} — {ing.quantity} {ing.unit}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => handleDelete(recipe.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium py-2 rounded-xl transition border-none shadow-none"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recipes