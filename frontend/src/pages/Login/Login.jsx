import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [remember, setRemember] = useState(false)

    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleKeyDown = (e) => setCapsLock(e.getModifierState('CapsLock'))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const data = await login(form)
            loginUser(data.access_token, data.user, remember, data.first_login)
            navigate('/recipes')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0" />

            <div className="relative z-10 bg-white/80 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black">MealMind</h2>
                    <p className="text-black text-sm mt-1">Plan your meals with intelligence.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-black mb-1 block">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-black mb-1 block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 shadow-none"
                            >
                                {showPassword ? '🔒' : '🥕'}
                            </button>
                        </div>
                        {capsLock && passwordFocused && (
                            <p className="text-amber-500 text-xs mt-1">⚠️ Caps Lock is on</p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={e => setRemember(e.target.checked)}
                            className="w-4 h-4 accent-indigo-500"
                        />
                        <span className="text-sm text-black">Remember me</span>
                    </label>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-md text-indigo-500 hover:underline">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                    >
                        Sign in
                    </button>
                </form>

                <p className="text-center text-md text-black mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-500 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login