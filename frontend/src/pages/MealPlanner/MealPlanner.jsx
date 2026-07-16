import { useState, useEffect } from 'react'
import { getMealPlans, createMealPlan, deleteMealPlan, completeMealPlan } from '../../services/mealPlanService'
import { getRecipes } from '../../services/recipeService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useLang from '../../hooks/useLang'

const ALL_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ALL_DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEALS = ['breakfast', 'lunch', 'dinner']

const getDaysFromDate = (dateStr, lang) => {
    const ALL_DAYS = lang === 'es' ? ALL_DAYS_ES : ALL_DAYS_EN
    if (!dateStr) return ALL_DAYS
    const date = new Date(dateStr + 'T00:00:00')
    const jsDay = date.getDay()
    const startIndex = jsDay === 0 ? 6 : jsDay - 1
    return [...ALL_DAYS.slice(startIndex), ...ALL_DAYS.slice(0, startIndex)]
}

const MEAL_LABELS = {
    en: { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' },
    es: { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }
}

const MealPlanner = () => {
    const [saving, setSaving] = useState(false)
    const [plans, setPlans] = useState([])
    const [recipes, setRecipes] = useState([])
    const [weekStart, setWeekStart] = useState('')
    const [entries, setEntries] = useState({})
    const [openDay, setOpenDay] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(null)
    const navigate = useNavigate()
    const { isPremium } = useAuth()
    const lang = useLang()

    const days = getDaysFromDate(weekStart, lang)
    const mealLabels = MEAL_LABELS[lang]

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const [plansData, recipesData] = await Promise.all([getMealPlans(), getRecipes(lang)])
            setPlans(plansData)
            setRecipes(recipesData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEntryChange = (day, meal, recipeId) => {
        setEntries({ ...entries, [`${day}_${meal}`]: recipeId })
    }

    const handleDateChange = (date) => {
        setWeekStart(date)
        setEntries({})
        setOpenDay(getDaysFromDate(date, lang)[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        const ALL_DAYS = lang === 'es' ? ALL_DAYS_ES : ALL_DAYS_EN
        const entriesArray = Object.entries(entries)
            .filter(([_, recipeId]) => recipeId)
            .map(([key, recipeId]) => {
                const [day, meal] = key.split('_')
                const dayIndex = ALL_DAYS.indexOf(day)
                const dayEn = ALL_DAYS_EN[dayIndex]
                return { day_of_week: dayEn, meal_type: meal, recipe_id: parseInt(recipeId) }
            })
        try {
            await createMealPlan({ week_start_date: weekStart, entries: entriesArray })
            setWeekStart('')
            setEntries({})
            setShowForm(false)
            await fetchData()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteMealPlan(id)
            fetchData()
        } catch (err) {
            setError(err.message)
        }
    }

    const getDayCount = (day) => MEALS.filter(meal => entries[`${day}_${meal}`]).length

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

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        📅 {lang === 'es' ? 'Planificador' : 'Meal Planner'}
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-4 py-2 rounded-xl text-md font-semibold transition active:scale-95 border-none shadow-md ${showForm ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                    >
                        {showForm
                            ? (lang === 'es' ? 'Cancelar' : 'Cancel')
                            : '+ ' + (lang === 'es' ? 'Nuevo plan' : 'New plan')}
                    </button>
                </div>

                {!isPremium && (
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className='text-2xl'>
                                🥦
                            </span>
                            <div>
                                <p className="text-white font-bold text-lg">
                                    {lang === 'es' ? '¿Sin ideas para esta semana?' : 'No ideas for this week?'}
                                </p>
                                <p className="text-white/90 text-md mt-1">
                                    {lang === 'es'
                                        ? 'Deja que la IA cree tu plan según tus calorías, ingredientes y alergias.'
                                        : 'Let AI build your plan based on your calories, ingredients and allergies.'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/premium')}
                            className="whitespace-nowrap px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl transition active:scale-95 border-none shadow-md hover:bg-orange-50"
                        >
                            {lang === 'es' ? 'Probar gratis' : 'Try for free'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-md px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                {showForm && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6 relative z-10">
                        <h2 className="text-lg font-bold text-black mb-4">
                            {lang === 'es' ? 'Nuevo plan semanal' : 'New weekly plan'}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {lang === 'es' ? 'Fecha de inicio' : 'Start date'}
                                </label>
                                <input
                                    type="date"
                                    value={weekStart}
                                    onChange={e => handleDateChange(e.target.value)}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                                />
                            </div>

                            {!weekStart && (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-md text-orange-600 text-center">
                                    📅 {lang === 'es' ? 'Selecciona una fecha de inicio' : 'Select a start date first'}
                                </div>
                            )}

                            {weekStart && (
                                <div className="flex flex-col gap-3">
                                    {days.map(day => (
                                        <div
                                            key={day}
                                            className={`rounded-2xl border-2 transition-all ${openDay === day ? 'border-orange-400 shadow-md' : 'border-transparent'}`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setOpenDay(openDay === day ? null : day)}
                                                className={`w-full flex items-center justify-between px-5 py-4 border-none shadow-none text-left transition rounded-2xl ${openDay === day ? 'bg-orange-500' : 'bg-white/60 hover:bg-white/80'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${openDay === day ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                                        {day.slice(0, 2)}
                                                    </div>
                                                    <span className={`font-semibold text-sm ${openDay === day ? 'text-white' : 'text-gray-700'}`}>
                                                        {day}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getDayCount(day) > 0 && (
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${openDay === day ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                                                            {getDayCount(day)} / 3
                                                        </span>
                                                    )}
                                                    <span className={`text-xs ${openDay === day ? 'text-white/70' : 'text-gray-400'}`}>
                                                        {openDay === day ? '▲' : '▼'}
                                                    </span>
                                                </div>
                                            </button>

                                            {openDay === day && (
                                                <div className="px-5 pb-4 pt-3 bg-white rounded-b-2xl flex flex-col gap-3">
                                                    {MEALS.map(meal => (
                                                        <div key={meal} className="flex items-center gap-3">
                                                            <span className="text-lg w-7 text-center">
                                                                {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-gray-400 mb-1">
                                                                    {mealLabels[meal].split(' ')[1]}
                                                                </p>
                                                                <select
                                                                    value={entries[`${day}_${meal}`] || ''}
                                                                    onChange={e => handleEntryChange(day, meal, e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-orange-400 transition"
                                                                >
                                                                    <option value="">
                                                                        {lang === 'es' ? '— Sin asignar —' : '— Not assigned —'}
                                                                    </option>
                                                                    {recipes.map(r => (
                                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        {lang === 'es' ? 'Guardando plan...' : 'Saving plan...'}
                                    </>
                                ) : (
                                    lang === 'es' ? 'Guardar plan' : 'Save plan'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex flex-col gap-3 relative z-0">
                    {loading || saving ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
                            <p className="text-neutral-400 text-lg">
                                {saving
                                    ? lang === 'es' ? 'Guardando plan...' : 'Saving plan...'
                                    : lang === 'es' ? 'Cargando planes...' : 'Loading plans...'}
                            </p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="rounded-2xl text-center py-16 text-xl text-neutral-400 bg-neutral-900 border border-neutral-800">
                            {lang === 'es' ? 'No hay planes aún.. ¡Crea el primero!' : 'No plans yet.. create your first one!'}
                        </div>
                    ) : (
                        plans.map(plan => (
                            <div key={plan.id} className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${plan.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-neutral-900 border-neutral-800'}`}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        {plan.completed && <span className="text-emerald-400">✅</span>}
                                        <h4 className="font-bold text-white">
                                            {lang === 'es' ? 'Semana del' : 'Week of'} {plan.week_start_date}
                                        </h4>
                                    </div>
                                    <p className="text-neutral-400 text-md mt-0.5">
                                        {plan.entries.length} {lang === 'es' ? 'comidas planificadas' : 'meals planned'}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/meal-planner/${plan.id}`)}
                                        className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-medium rounded-xl transition border-none shadow-none"
                                    >
                                        {lang === 'es' ? 'Ver' : 'View'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/shopping/${plan.id}`)}
                                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition border-none shadow-none"
                                    >
                                        {lang === 'es' ? 'Lista de la compra' : 'Shopping list'}
                                    </button>
                                    {plan.completed && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await completeMealPlan(plan.id)
                                                    fetchData()
                                                } catch (err) {
                                                    setError(err.message)
                                                }
                                            }}
                                            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-medium rounded-xl transition border-none shadow-none"
                                        >
                                            {lang === 'es' ? 'Marcar incompleto' : 'Mark incomplete'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setConfirmDelete(plan.id)}
                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition border-none shadow-none"
                                    >
                                        {lang === 'es' ? 'Eliminar' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {confirmDelete && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {lang === 'es' ? '¿Eliminar plan?' : 'Delete plan?'}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {lang === 'es' ? 'Esta acción no se puede deshacer.' : 'This action cannot be undone.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition border-none"
                                    >
                                        {lang === 'es' ? 'Cancelar' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={() => { handleDelete(confirmDelete); setConfirmDelete(null) }}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                                    >
                                        {lang === 'es' ? 'Eliminar' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MealPlanner