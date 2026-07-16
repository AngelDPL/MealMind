import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../services/authService'
import useLang from '../../hooks/useLang'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const lang = useLang()
    const [form, setForm] = useState({ new_password: '', confirm_password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const passwordsMatch = form.confirm_password && form.new_password === form.confirm_password

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!passwordsMatch) {
            setError(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match')
            return
        }
        setLoading(true)
        try {
            await resetPassword({ token: searchParams.get('token'), ...form })
            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative bg-neutral-950 overflow-hidden">

            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/90 to-neutral-950" />

            <div className="relative z-10 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔑</div>
                    <h2 className="text-2xl font-bold text-white">
                        {lang === 'es' ? 'Nueva contraseña' : 'New password'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">⚠️ {error}</div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">
                            {lang === 'es' ? 'Nueva contraseña' : 'New password'}
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={form.new_password}
                                onChange={e => setForm({ ...form, new_password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 pr-12 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0 text-xs text-neutral-500 hover:text-neutral-300">
                                {showNew ? (lang === 'es' ? 'ocultar' : 'hide') : (lang === 'es' ? 'ver' : 'show')}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">
                            {lang === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={form.confirm_password}
                                onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                                required
                                className={`w-full px-4 py-2.5 pr-12 border rounded-xl text-sm bg-neutral-800 text-white focus:outline-none transition ${
                                    form.confirm_password
                                        ? passwordsMatch ? 'border-emerald-500/60' : 'border-red-500/60'
                                        : 'border-neutral-700 focus:border-orange-500/60'
                                }`}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0 text-xs text-neutral-500 hover:text-neutral-300">
                                {showConfirm ? (lang === 'es' ? 'ocultar' : 'hide') : (lang === 'es' ? 'ver' : 'show')}
                            </button>
                        </div>
                        {form.confirm_password && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                {passwordsMatch
                                    ? lang === 'es' ? 'Las contraseñas coinciden' : 'Passwords match'
                                    : lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match'}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                    >
                        {loading ? '...' : lang === 'es' ? 'Restablecer contraseña' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword