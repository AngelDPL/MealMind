import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { changePassword, requestEmailChange } from '../../services/authService'
import { getRecipes } from '../../services/recipeService'
import { getMealPlans } from '../../services/mealPlanService'
import { getPreferences, updatePreferences } from '../../services/aiService'
import useLang from '../../hooks/useLang'

const t = {
    en: {
        title: 'Profile',
        usernameSection: 'Username',
        emailSection: 'Change email',
        passwordSection: 'Change password',
        currentEmail: 'Current email',
        newEmail: 'New email',
        confirmWithPassword: 'Confirm with your current password',
        sendConfirmation: 'Send confirmation email',
        emailPending: 'Confirmation email sent to',
        emailPendingNote: 'Click the link in the email to confirm the change.',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        updatePassword: 'Update password',
        passwordMatch: 'Passwords match',
        passwordNoMatch: 'Passwords do not match',
        forgotPassword: 'Forgot your password?',
        summaryTitle: 'Your summary',
        recipesCreated: 'Recipes created',
        mealPlans: 'Meal plans',
        noMealPlans: 'No meal plans yet.',
        caloriesTotal: 'total calories',
        preferencesTitle: '🥦 AI preferences',
        preferencesDesc: 'These preferences are always applied when Broky generates a plan for you.',
        allergies: 'Allergies',
        allergiesPlaceholder: 'e.g. peanuts, shellfish, dairy',
        preferredIngredients: 'Preferred ingredients',
        preferredIngredientsPlaceholder: 'e.g. chicken, rice, broccoli',
        dietaryStyle: 'Dietary style',
        dietaryStyleNone: 'No specific style',
        maxCalories: 'Default max calories per meal',
        savePreferences: 'Save preferences',
        preferencesSaved: 'Preferences saved',
    },
    es: {
        title: 'Perfil',
        usernameSection: 'Nombre de usuario',
        emailSection: 'Cambiar correo',
        passwordSection: 'Cambiar contraseña',
        currentEmail: 'Correo actual',
        newEmail: 'Nuevo correo',
        confirmWithPassword: 'Confirma con tu contraseña actual',
        sendConfirmation: 'Enviar correo de confirmación',
        emailPending: 'Correo de confirmación enviado a',
        emailPendingNote: 'Haz clic en el enlace del correo para confirmar el cambio.',
        currentPassword: 'Contraseña actual',
        newPassword: 'Nueva contraseña',
        confirmPassword: 'Confirmar nueva contraseña',
        updatePassword: 'Actualizar contraseña',
        passwordMatch: 'Las contraseñas coinciden',
        passwordNoMatch: 'Las contraseñas no coinciden',
        forgotPassword: '¿Olvidaste tu contraseña?',
        summaryTitle: 'Tu resumen',
        recipesCreated: 'Recetas creadas',
        mealPlans: 'Planes de comida',
        noMealPlans: 'Aún no tienes planes de comida.',
        caloriesTotal: 'calorías totales',
        preferencesTitle: '🥦 Preferencias de IA',
        preferencesDesc: 'Estas preferencias siempre se aplican cuando Broky genera un plan para ti.',
        allergies: 'Alergias',
        allergiesPlaceholder: 'ej. cacahuetes, mariscos, lácteos',
        preferredIngredients: 'Ingredientes preferidos',
        preferredIngredientsPlaceholder: 'ej. pollo, arroz, brócoli',
        dietaryStyle: 'Estilo dietético',
        dietaryStyleNone: 'Sin estilo específico',
        maxCalories: 'Calorías máximas por comida (por defecto)',
        savePreferences: 'Guardar preferencias',
        preferencesSaved: 'Preferencias guardadas',
    }
}

const SuccessMsg = ({ msg }) => (
    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-md px-4 py-3 rounded-xl mb-4">{msg}</div>
)
const ErrorMsg = ({ msg }) => (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-md px-4 py-3 rounded-xl mb-4">{msg}</div>
)

const DIETARY_STYLES = ['vegan', 'vegetarian', 'keto', 'paleo', 'mediterranean']

const Profile = () => {
    const navigate = useNavigate()
    const { user, isPremium } = useAuth()
    const lang = useLang()
    const tx = t[lang]

    const [summaryLoading, setSummaryLoading] = useState(true)
    const [recipeCount, setRecipeCount] = useState(0)
    const [mealPlanSummaries, setMealPlanSummaries] = useState([])

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const [recipes, mealPlans] = await Promise.all([
                    getRecipes(lang),
                    getMealPlans(),
                ])

                setRecipeCount(recipes.length)

                const summaries = mealPlans.map(plan => {
                    const totalCalories = plan.entries.reduce((sum, entry) => {
                        return sum + (entry.recipe?.calories || 0)
                    }, 0)
                    return {
                        id: plan.id,
                        week_start_date: plan.week_start_date,
                        totalCalories: Math.round(totalCalories),
                        mealCount: plan.entries.length,
                    }
                })
                setMealPlanSummaries(summaries)
            } catch {
            } finally {
                setSummaryLoading(false)
            }
        }
        fetchSummary()
    }, [lang])

    const [prefsLoading, setPrefsLoading] = useState(true)
    const [allergiesInput, setAllergiesInput] = useState('')
    const [ingredientsInput, setIngredientsInput] = useState('')
    const [dietaryStyle, setDietaryStyle] = useState('')
    const [maxCalories, setMaxCalories] = useState('')
    const [prefsSuccess, setPrefsSuccess] = useState('')
    const [prefsError, setPrefsError] = useState('')
    const [prefsSaving, setPrefsSaving] = useState(false)

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const prefs = await getPreferences()
                if (prefs) {
                    setAllergiesInput((prefs.allergies || []).join(', '))
                    setIngredientsInput((prefs.preferred_ingredients || []).join(', '))
                    setDietaryStyle(prefs.dietary_style || '')
                    setMaxCalories(prefs.max_calories_per_meal || '')
                }
            } catch {
            } finally {
                setPrefsLoading(false)
            }
        }
        fetchPrefs()
    }, [])

    const handleSavePreferences = async (e) => {
        e.preventDefault()
        setPrefsError('')
        setPrefsSuccess('')
        setPrefsSaving(true)
        try {
            const payload = {
                allergies: allergiesInput.split(',').map(a => a.trim()).filter(Boolean),
                preferred_ingredients: ingredientsInput.split(',').map(i => i.trim()).filter(Boolean),
                dietary_style: dietaryStyle || null,
                max_calories_per_meal: maxCalories ? Number(maxCalories) : null,
            }
            await updatePreferences(payload)
            setPrefsSuccess(tx.preferencesSaved)
        } catch (err) {
            setPrefsError(err.message)
        } finally {
            setPrefsSaving(false)
        }
    }

    const [emailForm, setEmailForm] = useState({ new_email: '', password: '' })
    const [emailSuccess, setEmailSuccess] = useState('')
    const [emailError, setEmailError] = useState('')
    const [emailPending, setEmailPending] = useState('')
    const [emailLoading, setEmailLoading] = useState(false)

    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const passwordsMatch = passwordForm.confirm_password && passwordForm.new_password === passwordForm.confirm_password

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setEmailError('')
        setEmailSuccess('')
        setEmailLoading(true)
        try {
            await requestEmailChange(emailForm)
            setEmailPending(emailForm.new_email)
            setEmailForm({ new_email: '', password: '' })
        } catch (err) {
            setEmailError(err.message)
        } finally {
            setEmailLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')
        if (!passwordsMatch) {
            setPasswordError(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match')
            return
        }
        setPasswordLoading(true)
        try {
            await changePassword({
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
                confirm_password: passwordForm.confirm_password
            })
            setPasswordSuccess(lang === 'es' ? 'Contraseña actualizada correctamente' : 'Password updated successfully')
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
        } catch (err) {
            setPasswordError(err.message)
        } finally {
            setPasswordLoading(false)
        }
    }

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

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

                <h1 className="text-2xl font-bold text-white">{tx.title}</h1>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">{tx.summaryTitle}</h2>

                    {summaryLoading ? (
                        <div className="flex justify-center py-6">
                            <div className="w-6 h-6 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="bg-orange-500/10 rounded-xl p-4 text-center mb-4">
                                <p className="text-2xl font-bold text-orange-400">{recipeCount}</p>
                                <p className="text-xs text-neutral-400 mt-1">{tx.recipesCreated}</p>
                            </div>

                            <h3 className="text-md font-semibold text-neutral-300 mb-2">{tx.mealPlans}</h3>
                            {mealPlanSummaries.length === 0 ? (
                                <p className="text-md text-neutral-500">{tx.noMealPlans}</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {mealPlanSummaries.map(plan => (
                                        <button
                                            key={plan.id}
                                            onClick={() => navigate(`/meal-planner/${plan.id}`)}
                                            className="w-full flex items-center justify-between bg-neutral-800/60 hover:bg-neutral-800 rounded-xl px-4 py-2.5 transition border-none shadow-none text-left"
                                        >
                                            <span className="text-md text-neutral-300">
                                                {lang === 'es' ? 'Semana del' : 'Week of'} {plan.week_start_date}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-md font-semibold text-white">
                                                    {plan.totalCalories} {tx.caloriesTotal}
                                                </span>
                                                <span className="text-neutral-500 text-sm">→</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        {tx.preferencesTitle}
                    </h2>
                    <p className="text-md text-neutral-400 mb-4">{tx.preferencesDesc}</p>

                    {prefsSuccess && <SuccessMsg msg={prefsSuccess} />}
                    {prefsError && <ErrorMsg msg={prefsError} />}

                    {prefsLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
                            <div>
                                <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.allergies}</label>
                                <input
                                    type="text"
                                    value={allergiesInput}
                                    onChange={e => setAllergiesInput(e.target.value)}
                                    placeholder={tx.allergiesPlaceholder}
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                            </div>
                            <div>
                                <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.preferredIngredients}</label>
                                <input
                                    type="text"
                                    value={ingredientsInput}
                                    onChange={e => setIngredientsInput(e.target.value)}
                                    placeholder={tx.preferredIngredientsPlaceholder}
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.dietaryStyle}</label>
                                    <select
                                        value={dietaryStyle}
                                        onChange={e => setDietaryStyle(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                    >
                                        <option value="">{tx.dietaryStyleNone}</option>
                                        {DIETARY_STYLES.map(style => (
                                            <option key={style} value={style}>{style}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.maxCalories}</label>
                                    <input
                                        type="number"
                                        min="100"
                                        value={maxCalories}
                                        onChange={e => setMaxCalories(e.target.value)}
                                        placeholder="700"
                                        className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={prefsSaving}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                            >
                                {prefsSaving ? '...' : tx.savePreferences}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-1">{tx.usernameSection}</h2>
                    <p className="text-md text-neutral-400">@{user?.username}</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-1">{tx.emailSection}</h2>
                    <p className="text-md text-neutral-400 mb-4">{tx.currentEmail}: <span className="font-medium text-neutral-200">{user?.email}</span></p>

                    {emailSuccess && <SuccessMsg msg={emailSuccess} />}
                    {emailError && <ErrorMsg msg={emailError} />}

                    {emailPending ? (
                        <div className="bg-orange-500/10 border border-orange-500/30 text-orange-300 text-md px-4 py-3 rounded-xl">
                            <p className="font-semibold">{tx.emailPending} {emailPending}</p>
                            <p className="mt-1 text-orange-400/80">{tx.emailPendingNote}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.newEmail}</label>
                                <input
                                    type="email"
                                    value={emailForm.new_email}
                                    onChange={e => setEmailForm({ ...emailForm, new_email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                            </div>
                            <div>
                                <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.confirmWithPassword}</label>
                                <input
                                    type="password"
                                    value={emailForm.password}
                                    onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={emailLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                            >
                                {emailLoading ? '...' : tx.sendConfirmation}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">{tx.passwordSection}</h2>

                    {passwordSuccess && <SuccessMsg msg={passwordSuccess} />}
                    {passwordError && <ErrorMsg msg={passwordError} />}

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.currentPassword}</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={passwordForm.current_password}
                                    onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 pr-12 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0 text-xs text-neutral-500 hover:text-neutral-300">
                                    {showCurrent ? 'hide' : 'show'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.newPassword}</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={passwordForm.new_password}
                                    onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 pr-12 border border-neutral-700 rounded-xl text-md bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0 text-xs text-neutral-500 hover:text-neutral-300">
                                    {showNew ? 'hide' : 'show'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-md font-medium text-neutral-300 mb-1 block">{tx.confirmPassword}</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={passwordForm.confirm_password}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                    required
                                    className={`w-full px-4 py-2.5 pr-12 border rounded-xl text-md bg-neutral-800 text-white focus:outline-none transition ${passwordForm.confirm_password
                                            ? passwordsMatch
                                                ? 'border-emerald-500/60 focus:border-emerald-500'
                                                : 'border-red-500/60 focus:border-red-500'
                                            : 'border-neutral-700 focus:border-orange-500/60'
                                        }`}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0 text-xs text-neutral-500 hover:text-neutral-300">
                                    {showConfirm ? 'hide' : 'show'}
                                </button>
                            </div>
                            {passwordForm.confirm_password && (
                                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {passwordsMatch ? tx.passwordMatch : tx.passwordNoMatch}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                        >
                            {passwordLoading ? '...' : tx.updatePassword}
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-500 mt-4">
                        <a href="/forgot-password" className="text-orange-400 hover:underline">{tx.forgotPassword}</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile