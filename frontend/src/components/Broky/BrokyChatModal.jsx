import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { generateMealPlan, saveAIPlan } from '../../services/aiService'
import useLang from '../../hooks/useLang'
import { useNavigate } from 'react-router-dom'

const ALL_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DAY_LABELS = {
    en: { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' },
    es: { Monday: 'Lun', Tuesday: 'Mar', Wednesday: 'Mié', Thursday: 'Jue', Friday: 'Vie', Saturday: 'Sáb', Sunday: 'Dom' },
}

const MEAL_LABELS = {
    en: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' },
    es: { breakfast: 'Desayuno', lunch: 'Comida', dinner: 'Cena' },
}

const NEGATIVE_RESPONSES = ['no', 'ninguna', 'ninguno', 'none', 'n/a', 'no allergies', 'ninguna alergia', 'nada']

const STEPS = {
    SCOPE: 'scope',
    START_DATE: 'start_date',
    PICK_DAYS: 'pick_days',
    CALORIES: 'calories',
    INGREDIENTS: 'ingredients',
    ALLERGIES: 'allergies',
    GENERATING: 'generating',
    RESULT: 'result',
    ERROR: 'error',
}

const BrokyBubble = ({ children }) => (
    <div className="flex items-start gap-2 mb-3">
        <span className="text-xl shrink-0">🥦</span>
        <div className="bg-neutral-800 rounded-2xl rounded-tl-lg px-4 py-2.5 text-lg text-white max-w-[85%]">
            {children}
        </div>
    </div>
)

const UserBubble = ({ children }) => (
    <div className="flex justify-end mb-3">
        <div className="bg-orange-500 text-white rounded-2xl rounded-tr-lg px-4 py-2.5 text-lg max-w-[85%]">
            {children}
        </div>
    </div>
)

const BrokyChatModal = ({ onClose }) => {
    const navigate = useNavigate()

    const [step, setStep] = useState(STEPS.SCOPE)
    const [history, setHistory] = useState([])
    const [selectedDays, setSelectedDays] = useState([])
    const [startDate, setStartDate] = useState('')
    const [maxCalories, setMaxCalories] = useState(700)
    const [ingredientsInput, setIngredientsInput] = useState('')
    const [extraAllergiesInput, setExtraAllergiesInput] = useState('')
    const [result, setResult] = useState(null)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const lang = useLang()
    const { user } = useAuth()
    const savedAllergies = user?.preferences?.allergies || []

    const pushToHistory = (question, answer) => {
        setHistory(prev => [...prev, { question, answer }])
    }

    const today = new Date().toISOString().split('T')[0]

    const todayDayName = () => {
        const idx = new Date().getDay()
        return ALL_DAYS_EN[idx === 0 ? 6 : idx - 1]
    }

    const chooseToday = () => {
        const dayName = todayDayName()
        setSelectedDays([dayName])
        pushToHistory(
            lang === 'es' ? '¿Qué plan armamos hoy?' : 'What plan should we build today?',
            lang === 'es' ? 'Solo hoy' : 'Just today'
        )
        setStep(STEPS.CALORIES)
    }

    const chooseWeek = () => {
        setSelectedDays(ALL_DAYS_EN)
        pushToHistory(
            lang === 'es' ? '¿Qué plan armamos hoy?' : 'What plan should we build today?',
            lang === 'es' ? 'Toda la semana' : 'Whole week'
        )
        setStep(STEPS.START_DATE)
    }

    const choosePickDays = () => {
        pushToHistory(
            lang === 'es' ? '¿Qué plan armamos hoy?' : 'What plan should we build today?',
            lang === 'es' ? 'Elegir días' : 'Pick days'
        )
        setStep(STEPS.PICK_DAYS)
    }

    const chooseStartToday = () => {
        setStartDate(today)
        pushToHistory(
            lang === 'es' ? '¿Qué fecha de inicio quieres?' : 'What start date do you want?',
            lang === 'es' ? 'Empezar hoy' : 'Start today'
        )
        setStep(STEPS.CALORIES)
    }

    const confirmCustomStartDate = () => {
        if (!startDate) return
        pushToHistory(
            lang === 'es' ? '¿Qué fecha de inicio quieres?' : 'What start date do you want?',
            startDate
        )
        setStep(STEPS.CALORIES)
    }

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const confirmPickedDays = () => {
        if (selectedDays.length === 0) return
        const labels = selectedDays.map(d => DAY_LABELS[lang][d]).join(', ')
        pushToHistory(
            lang === 'es' ? '¿Qué días necesitas?' : 'Which days do you need?',
            labels
        )
        setStep(STEPS.CALORIES)
    }

    const confirmCalories = () => {
        pushToHistory(
            lang === 'es' ? '¿Cuántas calorías máximo por comida?' : 'Max calories per meal?',
            `${maxCalories} cal`
        )
        setStep(STEPS.INGREDIENTS)
    }

    const confirmIngredients = () => {
        pushToHistory(
            lang === 'es' ? '¿Algún ingrediente que quieras que use?' : 'Any ingredients you want me to use?',
            ingredientsInput.trim() || (lang === 'es' ? 'Ninguno en particular' : 'None in particular')
        )
        setStep(STEPS.ALLERGIES)
    }

    const handleGenerate = async () => {
        pushToHistory(
            savedAllergies.length > 0
                ? (lang === 'es'
                    ? `Ya sé que eres alérgico a: ${savedAllergies.join(', ')}. ¿Añadimos algo más?`
                    : `I already know you're allergic to: ${savedAllergies.join(', ')}. Anything else?`)
                : (lang === 'es' ? '¿Alguna alergia que deba evitar?' : 'Any allergies I should avoid?'),
            extraAllergiesInput.trim() || (lang === 'es' ? 'Ninguna' : 'None')
        )

        setStep(STEPS.GENERATING)
        setErrorMsg('')

        const preferredIngredients = ingredientsInput
            .split(',')
            .map(i => i.trim())
            .filter(Boolean)
            .filter(i => !NEGATIVE_RESPONSES.includes(i.toLowerCase()))

        const extraAllergies = extraAllergiesInput
            .split(',')
            .map(a => a.trim())
            .filter(Boolean)
            .filter(a => !NEGATIVE_RESPONSES.includes(a.toLowerCase()))

        try {
            const data = await generateMealPlan({
                days: selectedDays,
                max_calories_per_meal: Number(maxCalories),
                preferred_ingredients: preferredIngredients,
                allergies: extraAllergies,
                lang,
            })
            setResult(data)
            setStep(STEPS.RESULT)
        } catch (err) {
            setErrorMsg(err.message || 'Error')
            setStep(STEPS.ERROR)
        }
    }

    const handleSave = async () => {
        if (!result) return
        setSaving(true)
        try {
            await saveAIPlan({
                plan: result.plan,
                week_start_date: startDate || today,
                lang,
            })
            setSaved(true)
            window.dispatchEvent(new CustomEvent('mealPlanCreated'))
            onClose()
            navigate('/meal-planner')
        } catch {
            setErrorMsg(lang === 'es' ? 'No se pudo guardar el plan.' : 'Could not save the plan.')
        } finally {
            setSaving(false)
        }
    }

    const resetFlow = () => {
        setStep(STEPS.SCOPE)
        setHistory([])
        setSelectedDays([])
        setStartDate('')
        setMaxCalories(700)
        setIngredientsInput('')
        setExtraAllergiesInput('')
        setResult(null)
        setSaved(false)
        setErrorMsg('')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">

                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🥦</span>
                        <span className="font-bold text-white">Broky</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-300 bg-transparent border-none shadow-none text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">

                    {history.map((entry, i) => (
                        <div key={i}>
                            <BrokyBubble>{entry.question}</BrokyBubble>
                            <UserBubble>{entry.answer}</UserBubble>
                        </div>
                    ))}

                    {step === STEPS.SCOPE && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¿Qué plan armamos hoy?' : "What plan should we build today?"}
                            </BrokyBubble>
                            <div className="flex flex-col gap-2 ml-9">
                                <button onClick={chooseToday} className="text-left px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 rounded-xl text-lg font-medium transition border-none">
                                    {lang === 'es' ? 'Solo hoy' : 'Just today'}
                                </button>
                                <button onClick={chooseWeek} className="text-left px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 rounded-xl text-lg font-medium transition border-none">
                                    {lang === 'es' ? 'Toda la semana' : 'Whole week'}
                                </button>
                                <button onClick={choosePickDays} className="text-left px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 rounded-xl text-lg font-medium transition border-none">
                                    {lang === 'es' ? 'Elegir días' : 'Pick days'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.START_DATE && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¿Qué fecha de inicio quieres?' : 'What start date do you want?'}
                            </BrokyBubble>
                            <div className="ml-9 flex flex-col gap-2">
                                <button onClick={chooseStartToday} className="text-left px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 rounded-xl text-lg font-medium transition border-none">
                                    {lang === 'es' ? 'Empezar hoy' : 'Start today'}
                                </button>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        min={today}
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-xl text-lg bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                    />
                                    <button
                                        onClick={confirmCustomStartDate}
                                        disabled={!startDate}
                                        className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold transition border-none disabled:opacity-40"
                                    >
                                        {lang === 'es' ? 'Usar fecha' : 'Use date'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {step === STEPS.PICK_DAYS && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¿Qué días necesitas?' : 'Which days do you need?'}
                            </BrokyBubble>
                            <div className="ml-9">
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {ALL_DAYS_EN.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition border-none ${selectedDays.includes(day)
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                                }`}
                                        >
                                            {DAY_LABELS[lang][day]}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={confirmPickedDays}
                                    disabled={selectedDays.length === 0}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none disabled:opacity-40"
                                >
                                    {lang === 'es' ? 'Continuar' : 'Continue'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.CALORIES && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¿Cuántas calorías máximo por comida?' : 'Max calories per meal?'}
                            </BrokyBubble>
                            <div className="ml-9 flex flex-col gap-3">
                                <input
                                    type="number"
                                    min="100"
                                    value={maxCalories}
                                    onChange={e => setMaxCalories(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-lg bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                />
                                <button
                                    onClick={confirmCalories}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                                >
                                    {lang === 'es' ? 'Continuar' : 'Continue'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.INGREDIENTS && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¿Algún ingrediente que quieras que use? (opcional)' : 'Any ingredients you want me to use? (optional)'}
                            </BrokyBubble>
                            <div className="ml-9 flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={ingredientsInput}
                                    onChange={e => setIngredientsInput(e.target.value)}
                                    placeholder={lang === 'es' ? 'pollo, arroz, brócoli' : 'chicken, rice, broccoli'}
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-lg bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                                <button
                                    onClick={confirmIngredients}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                                >
                                    {lang === 'es' ? 'Continuar' : 'Continue'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.ALLERGIES && (
                        <>
                            {savedAllergies.length > 0 ? (
                                <BrokyBubble>
                                    {lang === 'es'
                                        ? `Ya sé que eres alérgico a: ${savedAllergies.join(', ')}. ¿Añadimos algo más solo para este plan?`
                                        : `I already know you're allergic to: ${savedAllergies.join(', ')}. Anything else just for this plan?`}
                                </BrokyBubble>
                            ) : (
                                <BrokyBubble>
                                    {lang === 'es'
                                        ? '¿Alguna alergia que deba evitar en este plan? (opcional)'
                                        : 'Any allergies I should avoid in this plan? (optional)'}
                                </BrokyBubble>
                            )}
                            <div className="ml-9 flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={extraAllergiesInput}
                                    onChange={e => setExtraAllergiesInput(e.target.value)}
                                    placeholder={lang === 'es' ? 'ej. lácteos' : 'e.g. dairy'}
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-lg bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                                <button
                                    onClick={handleGenerate}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                                >
                                    {lang === 'es' ? 'Generar plan' : 'Generate plan'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.GENERATING && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div className="w-10 h-10 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
                            <p className="text-neutral-400 text-lg">
                                {lang === 'es' ? 'Broky está cocinando tu plan...' : 'Broky is cooking up your plan...'}
                            </p>
                        </div>
                    )}

                    {step === STEPS.ERROR && (
                        <>
                            <BrokyBubble>
                                {lang === 'es'
                                    ? 'Ups, algo salió mal generando tu plan.'
                                    : 'Oops, something went wrong generating your plan.'}
                            </BrokyBubble>
                            <div className="ml-9">
                                <button
                                    onClick={handleGenerate}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none"
                                >
                                    {lang === 'es' ? 'Reintentar' : 'Try again'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === STEPS.RESULT && result && (
                        <>
                            <BrokyBubble>
                                {lang === 'es' ? '¡Listo! Aquí está tu plan.' : "Done! Here's your plan."}
                            </BrokyBubble>

                            {result.allergy_warnings?.length > 0 && (
                                <div className="ml-9 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl mb-4">
                                    {lang === 'es'
                                        ? 'Broky pudo haberse equivocado en algunas comidas marcadas abajo — revísalas antes de guardar.'
                                        : 'Broky may have slipped up on some meals marked below — please review before saving.'}
                                </div>
                            )}

                            <div className="ml-9 flex flex-col gap-3 mb-4">
                                {result.plan.days.map(day => (
                                    <div key={day.day} className="bg-neutral-800/60 rounded-xl p-3">
                                        <p className="font-semibold text-lg text-white mb-2">
                                            {DAY_LABELS[lang][day.day] || day.day}
                                        </p>
                                        <div className="flex flex-col gap-1.5">
                                            {day.meals.map(meal => {
                                                const hasWarning = result.allergy_warnings?.some(
                                                    w => w.day === day.day && w.meal_type === meal.type
                                                )
                                                return (
                                                    <div key={meal.type} className="flex items-center justify-between text-xs">
                                                        <span className="text-neutral-500">{MEAL_LABELS[lang][meal.type]}</span>
                                                        <span className={`font-medium ${hasWarning ? 'text-red-400' : 'text-neutral-300'}`}>
                                                            {meal.name} {hasWarning && '⚠️'}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errorMsg && (
                                <div className="ml-9 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl mb-3">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="ml-9 flex flex-col gap-2">
                                {saved ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-lg px-4 py-2.5 rounded-xl text-center font-medium">
                                        {lang === 'es' ? 'Plan guardado' : 'Plan saved'}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition border-none disabled:opacity-60"
                                    >
                                        {saving
                                            ? (lang === 'es' ? 'Guardando...' : 'Saving...')
                                            : (lang === 'es' ? 'Guardar plan' : 'Save plan')}
                                    </button>
                                )}
                                <button
                                    onClick={resetFlow}
                                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 rounded-xl transition border border-neutral-700"
                                >
                                    {lang === 'es' ? 'Generar otro' : 'Generate another'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BrokyChatModal