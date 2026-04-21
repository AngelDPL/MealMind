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
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
            <div className="absolute inset-0" />
            <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔑</div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {lang === 'es' ? 'Nueva contraseña' : 'New password'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">⚠️ {error}</div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {lang === 'es' ? 'Nueva contraseña' : 'New password'}
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={form.new_password}
                                onChange={e => setForm({ ...form, new_password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0">
                                {showNew ? '🫣' : '🥕'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {lang === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={form.confirm_password}
                                onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                                required
                                className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:bg-white transition ${
                                    form.confirm_password
                                        ? passwordsMatch ? 'border-green-400' : 'border-red-400'
                                        : 'border-gray-200 focus:border-indigo-400'
                                }`}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0">
                                {showConfirm ? '🫣' : '🥕'}
                            </button>
                        </div>
                        {form.confirm_password && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                {passwordsMatch
                                    ? lang === 'es' ? 'Las contraseñas coinciden' : 'Passwords match'
                                    : lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match'}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                    >
                        {loading ? '...' : lang === 'es' ? 'Restablecer contraseña' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword