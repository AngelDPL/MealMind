import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { generateMealPlan, saveAIPlan } from '../../services/aiService'
import useLang from '../../hooks/useLang'

const ALL_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const STEPS = {
    SCOPE: 'scope',
    PICK_DAYS: 'pick_days',
    CALORIES: 'calories',
    INGREDIENTS: 'ingredients',
    ALLERGIES: 'allergies',
    GENERATING: 'generating',
    RESULT: 'result',
    ERROR: 'error',
}

const BrokyChatModal = ({ onClose }) => {
    const [step, setStep] = useState(STEPS.SCOPE)
    const [selectedDays, setSelectedDays] = useState([])
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




    const chooseToday = () => {
        const todayIndex = new Date().getDay()
        const dayName = ALL_DAYS_EN[todayIndex === 0 ? 6 : todayIndex - 1]
        setSelectedDays([dayName])
        setStep(STEPS.CALORIES)
    }

    const chooseWeek = () => {
        setSelectedDays(ALL_DAYS_EN)
        setStep(STEPS.CALORIES)
    }

    const choosePickDays = () => {
        setStep(STEPS.PICK_DAYS)
    }

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const confirmPickedDays = () => {
        if (selectedDays.length === 0) return
        setStep(STEPS.CALORIES)
    }




    const confirmCalories = () => {
        setStep(STEPS.INGREDIENTS)
    }




    const confirmIngredients = () => {
        setStep(STEPS.ALLERGIES)
    }




    const handleGenerate = async () => {
        setStep(STEPS.GENERATING)
        setErrorMsg('')

        const preferredIngredients = ingredientsInput
            .split(',')
            .map(i => i.trim())
            .filter(Boolean)

        const extraAllergies = extraAllergiesInput
            .split(',')
            .map(a => a.trim())
            .filter(Boolean)

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
                max_calories_per_meal: Number(maxCalories),
            })
            setSaved(true)
        } catch {
            setErrorMsg(lang === 'es' ? 'No se pudo guardar el plan.' : 'Could not save the plan.')
        } finally {
            setSaving(false)
        }
    }




    const resetFlow = () => {
        setStep(STEPS.SCOPE)
        setSelectedDays([])
        setMaxCalories(700)
        setIngredientsInput('')
        setExtraAllergiesInput('')
        setResult(null)
        setSaved(false)
        setErrorMsg('')
    }


    return (
        <>
        </>
    )
}

export default BrokyChatModal