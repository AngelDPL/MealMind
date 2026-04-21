import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getShoppingList, generateShoppingList, toggleShoppingItem } from '../../services/shoppingService'
import { completeMealPlan } from '../../services/mealPlanService'
import useLang from '../../hooks/useLang'

const Shopping = () => {
    const { planId } = useParams()
    const navigate = useNavigate()
    const lang = useLang()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { fetchList() }, [])

    const fetchList = async () => {
        try {
            const data = await getShoppingList(planId)
            setItems(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            const data = await generateShoppingList(planId, lang)
            setItems(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setGenerating(false)
        }
    }

    const handleToggle = async (itemId) => {
        try {
            const updated = await toggleShoppingItem(itemId)
            setItems(items.map(i => i.id === itemId ? updated : i))
        } catch (err) {
            setError(err.message)
        }
    }

    const checkedCount = items.filter(i => i.checked).length

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white/80 text-sm">
                {lang === 'es' ? 'Cargando lista...' : 'Loading shopping list...'}
            </p>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">

            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/meal-planner")}
                    className="text-white/70 hover:text-white bg-transparent border-none shadow-none p-0 text-sm"
                >
                    ← {lang === 'es' ? 'Volver' : 'Back'}
                </button>
                <h1 className="text-2xl font-bold text-white drop-shadow">
                    🛒 {lang === 'es' ? 'Lista de la Compra' : 'Shopping List'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    ⚠️ {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-green-500 hover:bg-green-600 text-white/90 font-semibold py-3 rounded-2xl transition active:scale-95 border-none shadow-md mb-6 disabled:opacity-60"
            >
                {generating
                    ? '⏳ ' + (lang === 'es' ? 'Generando...' : 'Generating...')
                    : '🔄 ' + (lang === 'es' ? 'Generar / Actualizar lista' : 'Generate / Refresh list')}
            </button>

            {items.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            {lang === 'es' ? 'Progreso' : 'Progress'}
                        </span>
                        <span className="text-sm font-bold text-indigo-600">{checkedCount} / {items.length}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {items.length === 0 ? (
                <div className="rounded-2xl text-center py-16 text-xl text-white/90 bg-black/40">
                    {lang === 'es' ? 'Sin artículos. Genera la lista primero.' : 'No items yet. Generate the list first.'}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleToggle(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition border-none shadow-none text-left ${item.checked ? 'bg-white/40 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md shadow-md'}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${item.checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'}`}>
                                {item.checked && <span className="text-white text-xs">✓</span>}
                            </div>
                            <div className="flex-1">
                                <span className={`text-lg font-medium transition ${item.checked ? 'line-through text-gray-800' : 'text-gray-800'}`}>
                                    {item.name}
                                </span>
                            </div>
                            <span className={`text-lg font-semibold transition ${item.checked ? 'text-gray-800' : 'text-indigo-600'}`}>
                                {item.quantity} {item.unit}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {items.length > 0 && checkedCount === items.length && (
                <div className="mt-6 bg-green-50 rounded-2xl p-6 text-center flex flex-col gap-3">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-green-600 font-semibold">
                        {lang === 'es' ? '¡Todo marcado!' : 'All items checked!'}
                    </p>
                    <p className="text-green-500 text-sm mt-1">
                        {lang === 'es' ? 'Listo para cocinar.' : "You're ready to cook."}
                    </p>
                    <button
                        onClick={async () => {
                            await completeMealPlan(planId)
                            navigate('/meal-planner')
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none mt-2"
                    >
                        {lang === 'es' ? 'Hecho — Volver a planes' : 'Done — Back to plans'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Shopping