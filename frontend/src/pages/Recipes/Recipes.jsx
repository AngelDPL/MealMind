import { useState, useEffect, useMemo } from 'react'
import { getRecipes, createRecipe, deleteRecipe } from '../../services/recipeService'
import { useAuth } from '../../context/AuthContext'
import FoodSearch from '../../components/ui/FoodSearch'
import useLang from '../../hooks/useLang'
import RecipeCard from '../../components/ui/RecipeCard'

const Recipes = () => {

    const [form, setForm] = useState({ name: '', description: '' })
    const [ingredients, setIngredients] = useState([])
    const [pendingIngredient, setPendingIngredient] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('recent')
    const [showForm, setShowForm] = useState(false)
    const [usageWarning, setUsageWarning] = useState(null)

    const { firstLogin, setFirstLogin, user } = useAuth()
    const lang = useLang()

    useEffect(() => {
        fetchRecipes()
    }, [])

    const fetchRecipes = async () => {
        try {
            const data = await getRecipes(lang)
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
            if (err.usedIn) {
                setUsageWarning(err.usedIn)
            } else {
                setError(err.message)
            }
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

    const filteredRecipes = useMemo(() => {
        const filtered = recipes.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.name_es?.toLowerCase().includes(search.toLowerCase()) ||
            r.description?.toLowerCase().includes(search.toLowerCase())
        )
        const sorted = [...filtered]
        if (sortBy === 'recent') {
            sorted.sort((a, b) => b.id - a.id)
        } else if (sortBy === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name))
        }
        return sorted
    }, [recipes, search, sortBy])

    return (
        <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/90 to-neutral-950" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">

                {firstLogin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {lang === 'es' ? `¡Bienvenido, ${user.username}!` : `Welcome, ${user.username}!`}
                            </h3>
                            <p className="text-gray-500 text-md leading-relaxed">
                                {lang === 'es'
                                    ? <>Hemos añadido <span className="font-semibold text-orange-600">28 recetas</span> para que empieces con los macros ya calculados.</>
                                    : <>We've added <span className="font-semibold text-orange-600">28 recipes</span> to get you started with macros already calculated.</>
                                }
                            </p>
                            <div className="bg-orange-50 rounded-xl px-4 py-3 flex flex-col items-center gap-1">
                                <span className="text-2xl">🍽️</span>
                                <p className="text-orange-600 text-md font-medium">
                                    {lang === 'es' ? '¡Empieza a planificar tu menú semanal!' : 'Start planning your weekly menu!'}
                                </p>
                            </div>
                            <button
                                onClick={() => setFirstLogin(false)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                            >
                                {lang === 'es' ? '¡Vamos!' : "Let's go!"}
                            </button>
                        </div>
                    </div>
                )}

                {usageWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                {lang === 'es' ? 'No se puede eliminar' : 'Cannot delete'}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {lang === 'es'
                                    ? 'Esta receta se usa en los siguientes planes. Quítala de ahí primero si quieres eliminarla.'
                                    : 'This recipe is used in the following plans. Remove it from them first if you want to delete it.'}
                            </p>
                            <ul className="flex flex-col gap-1 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto">
                                {usageWarning.map((u, i) => (
                                    <li key={i}>
                                        {lang === 'es' ? 'Semana del' : 'Week of'} {u.week_start_date} — {u.day_of_week} ({u.meal_type})
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setUsageWarning(null)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition border-none"
                            >
                                {lang === 'es' ? 'Entendido' : 'Got it'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative rounded-3xl overflow-hidden mb-6 h-44 sm:h-52">
                    <img
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                    <div className="relative z-10 h-full flex items-center justify-between px-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {lang === 'es' ? 'Mis Recetas' : 'My Recipes'}
                            </h1>
                            <p className="text-neutral-300 text-sm mt-1">
                                {recipes.length} {lang === 'es' ? 'recetas guardadas' : 'recipes saved'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className={`px-4 py-2.5 rounded-full text-sm font-semibold transition active:scale-95 border-none shadow-lg whitespace-nowrap ${showForm
                                ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                        >
                            {showForm
                                ? '✕ ' + (lang === 'es' ? 'Cancelar' : 'Cancel')
                                : '+ ' + (lang === 'es' ? 'Nueva receta' : 'New recipe')
                            }
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-md px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                {showForm && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {lang === 'es' ? 'Nueva receta' : 'New recipe'}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            <div>
                                <label className="text-md font-medium text-gray-700 mb-1 block">
                                    {lang === 'es' ? 'Nombre de la receta' : 'Recipe name'}
                                </label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder={lang === 'es' ? 'ej. Pollo con arroz' : 'e.g. Chicken with rice'}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-md bg-gray-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                                />
                            </div>

                            <div>
                                <label className="text-md font-medium text-gray-700 mb-1 block">
                                    {lang === 'es' ? 'Descripción (opcional)' : 'Description (optional)'}
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder={lang === 'es' ? 'Breve descripción...' : 'Brief description...'}
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-md bg-gray-50 focus:outline-none focus:border-orange-400 focus:bg-white transition resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-md font-medium text-gray-700 mb-2 block">
                                    {lang === 'es' ? 'Ingredientes' : 'Ingredients'}
                                </label>
                                <FoodSearch onSelect={handleFoodSelect} lang={lang} />
                            </div>

                            {pendingIngredient && (
                                <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-3 rounded-xl">
                                    <span className="text-md font-medium text-gray-700 flex-1">
                                        {pendingIngredient.food.name}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder={`Amount (${pendingIngredient.food.unit})`}
                                        value={pendingIngredient.quantity}
                                        onChange={e => setPendingIngredient({ ...pendingIngredient, quantity: e.target.value })}
                                        className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-md bg-white focus:outline-none focus:border-orange-400 transition"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddIngredient}
                                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-md font-medium transition border-none"
                                    >
                                        {lang === 'es' ? 'Añadir' : 'Add'}
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
                                        <li key={i} className="flex justify-between items-center bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl text-md">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-400">🥄</span>
                                                <span className="font-medium text-gray-700">{ing.food_name}</span>
                                                <span className="text-gray-400">—</span>
                                                <span className="text-orange-600 font-semibold">{ing.quantity} {ing.unit}</span>
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
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                            >
                                {lang === 'es' ? 'Guardar receta' : 'Save recipe'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
                        <input
                            type="text"
                            placeholder={lang === 'es' ? 'Buscar recetas...' : 'Search recipes...'}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white bg-transparent border-none shadow-none p-0"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-sm focus:outline-none focus:border-orange-500/50 transition cursor-pointer"
                    >
                        <option value="recent">{lang === 'es' ? 'Ordenar: Recientes' : 'Sort: Recent'}</option>
                        <option value="name">{lang === 'es' ? 'Ordenar: Nombre A-Z' : 'Sort: Name A-Z'}</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
                        <p className="text-neutral-400 text-md">
                            {lang === 'es' ? 'Cargando recetas...' : 'Loading recipes...'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                        {filteredRecipes.length === 0 && (
                            <div className="col-span-full text-center py-16 text-neutral-500">
                                {search
                                    ? (lang === 'es' ? `No se encontraron recetas para "${search}"` : `No recipes found for "${search}"`)
                                    : (lang === 'es' ? 'No hay recetas aún. ¡Crea la primera!' : 'No recipes yet. Create your first one!')}
                            </div>
                        )}
                        {filteredRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onDelete={handleDelete}
                                lang={lang}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Recipes