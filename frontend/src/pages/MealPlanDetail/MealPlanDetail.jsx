import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMealPlans } from '../../services/mealPlanService'
import useLang from '../../hooks/useLang'

const MEALS = ['breakfast', 'lunch', 'dinner']

const ALL_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ALL_DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const MEAL_LABELS = {
    en: { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' },
    es: { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }
}

const MealPlanDetail = () => {
    const { planId } = useParams()
    const navigate = useNavigate()
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const lang = useLang()

    const ALL_DAYS_EN_FIXED = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const displayDays = lang === 'es' ? ALL_DAYS_ES : ALL_DAYS_EN
    const mealLabels = MEAL_LABELS[lang]

    useEffect(() => {
        fetchPlan()
    }, [])

    const fetchPlan = async () => {
        try {
            const plans = await getMealPlans()
            const found = plans.find(p => p.id === parseInt(planId))
            if (!found) {
                setError(lang === 'es' ? 'Plan no encontrado' : 'Plan not found')
                return
            }
            setPlan(found)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getEntry = (dayEn, meal) => {
        if (!plan) return null
        return plan.entries.find(e => e.day_of_week === dayEn && e.meal_type === meal)
    }

    const getTotalMacros = () => {
        if (!plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
        return plan.entries.reduce((acc, entry) => {
            if (!entry.recipe) return acc
            return {
                calories: acc.calories + entry.recipe.calories,
                protein: acc.protein + entry.recipe.protein,
                carbs: acc.carbs + entry.recipe.carbs,
                fat: acc.fat + entry.recipe.fat,
            }
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    }

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-neutral-400 text-sm">
                {lang === 'es' ? 'Cargando plan...' : 'Loading plan...'}
            </p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-neutral-950 max-w-3xl mx-auto px-4 py-6">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>
        </div>
    )

    const totals = getTotalMacros()

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

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">

                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/meal-planner')}
                        className="text-neutral-400 hover:text-white bg-transparent border-none shadow-none p-0 text-sm"
                    >
                        ← {lang === 'es' ? 'Volver' : 'Back'}
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        📅 {lang === 'es' ? 'Semana del' : 'Week of'} {plan.week_start_date}
                    </h1>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { label: lang === 'es' ? 'Calorías totales' : 'Total calories', value: `${totals.calories.toFixed(1)} kcal`, icon: '🔥', color: 'text-orange-400' },
                        { label: lang === 'es' ? 'Proteína total' : 'Total protein', value: `${totals.protein.toFixed(1)}g`, icon: '🌿', color: 'text-emerald-400' },
                        { label: lang === 'es' ? 'Carbos totales' : 'Total carbs', value: `${totals.carbs.toFixed(1)}g`, icon: '⚡', color: 'text-blue-400' },
                        { label: lang === 'es' ? 'Grasas totales' : 'Total fat', value: `${totals.fat.toFixed(1)}g`, icon: '💧', color: 'text-purple-400' },
                    ].map((m, i) => (
                        <div key={i} className="text-center py-3 px-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                            <p className={`text-sm font-bold ${m.color}`}>{m.icon} {m.value}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{m.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    {ALL_DAYS_EN_FIXED.map((dayEn, idx) => (
                        <div key={dayEn} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                            <div className="bg-orange-500 px-5 py-3">
                                <h3 className="font-bold text-white text-sm">{displayDays[idx]}</h3>
                            </div>
                            <div className="divide-y divide-neutral-800">
                                {MEALS.map(meal => {
                                    const entry = getEntry(dayEn, meal)
                                    return (
                                        <div key={meal} className="flex items-center gap-4 px-5 py-3">
                                            <span className="text-lg w-7 text-center">
                                                {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-neutral-500 mb-0.5">
                                                    {mealLabels[meal].split(' ')[1]}
                                                </p>
                                                {entry ? (
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{entry.recipe.name}</p>
                                                        <div className="flex gap-3 mt-1">
                                                            {[
                                                                { label: `🔥 ${entry.recipe.calories.toFixed(1)} kcal`, color: 'text-orange-400' },
                                                                { label: `🌿 ${entry.recipe.protein.toFixed(1)}g`, color: 'text-emerald-400' },
                                                                { label: `⚡ ${entry.recipe.carbs.toFixed(1)}g`, color: 'text-blue-400' },
                                                                { label: `💧 ${entry.recipe.fat.toFixed(1)}g`, color: 'text-purple-400' },
                                                            ].map((m, i) => (
                                                                <span key={i} className={`text-xs font-medium ${m.color}`}>{m.label}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-neutral-500 italic">
                                                        {lang === 'es' ? 'Sin asignar' : 'Not assigned'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => navigate(`/shopping/${planId}`)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition active:scale-95 border-none shadow-md"
                    >
                        🛒 {lang === 'es' ? 'Generar lista de la compra' : 'Generate shopping list'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MealPlanDetail