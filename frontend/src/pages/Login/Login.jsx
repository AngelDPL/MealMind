import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import useLang from '../../hooks/useLang'
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton'

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [remember, setRemember] = useState(false)

    const { loginUser } = useAuth()
    const navigate = useNavigate()
    const lang = useLang()

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
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">MealMind</h2>
                    <p className="text-neutral-400 text-md mt-1">
                        {lang === 'es' ? 'Planifica tus comidas con inteligencia.' : 'Plan your meals with intelligence.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 focus:bg-neutral-800 transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">
                            {lang === 'es' ? 'Contraseña' : 'Password'}
                        </label>
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
                                className="w-full px-4 py-2.5 pr-10 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 bg-transparent border-none p-0 shadow-none text-xs"
                            >
                                {showPassword ? (lang === 'es' ? 'ocultar' : 'hide') : (lang === 'es' ? 'ver' : 'show')}
                            </button>
                        </div>
                        {capsLock && passwordFocused && (
                            <p className="text-amber-400 text-xs mt-1">
                                ⚠️ {lang === 'es' ? 'Bloq Mayús activado' : 'Caps Lock is on'}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={e => setRemember(e.target.checked)}
                            className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-neutral-300">
                            {lang === 'es' ? 'Recuérdame' : 'Remember me'}
                        </span>
                    </label>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-md text-orange-400 hover:underline">
                            {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                    >
                        {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-neutral-800" />
                    <span className="text-xs text-neutral-500">{lang === 'es' ? 'o' : 'or'}</span>
                    <div className="flex-1 h-px bg-neutral-800" />
                </div>

                <GoogleLoginButton />

                <p className="text-center text-md text-neutral-400 mt-6">
                    {lang === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}
                    <Link to="/register" className="text-orange-400 font-semibold hover:underline">
                        {lang === 'es' ? 'Regístrate' : 'Sign up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login