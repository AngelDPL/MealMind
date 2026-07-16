import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/authService'
import useLang from '../../hooks/useLang'
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton'

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '' })
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const lang = useLang()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleKeyDown = (e) => setCapsLock(e.getModifierState('CapsLock'))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirm_password) {
            setError(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match')
            return
        }
        setLoading(true)
        try {
            await register(form)
            setShowModal(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleModalClose = () => {
        setShowModal(false)
        navigate('/login')
    }

    const passwordsMatch = form.confirm_password && form.password === form.confirm_password

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
                    <h2 className="text-4xl font-bold text-white">
                        {lang === 'es' ? 'Crear cuenta' : 'Create account'}
                    </h2>
                    <p className="text-neutral-400 text-md mt-1">
                        {lang === 'es' ? 'Empieza a planificar tus comidas' : 'Start planning your meals'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">
                            {lang === 'es' ? 'Nombre de usuario' : 'Username'}
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder={lang === 'es' ? 'tunombre' : 'yourname'}
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
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
                                className="w-full px-4 py-2.5 pr-12 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white focus:outline-none focus:border-orange-500/60 transition"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 shadow-none text-xs text-neutral-500 hover:text-neutral-300">
                                {showPassword ? (lang === 'es' ? 'ocultar' : 'hide') : (lang === 'es' ? 'ver' : 'show')}
                            </button>
                        </div>
                        {capsLock && passwordFocused && (
                            <p className="text-amber-400 text-xs mt-1">
                                ⚠️ {lang === 'es' ? 'Bloq Mayús activado' : 'Caps Lock is on'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-300 mb-1 block">
                            {lang === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder="••••••••"
                                value={form.confirm_password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                required
                                className={`w-full px-4 py-2.5 pr-12 border rounded-xl text-sm bg-neutral-800 text-white focus:outline-none transition ${form.confirm_password
                                        ? passwordsMatch
                                            ? 'border-emerald-500/60 focus:border-emerald-500'
                                            : 'border-red-500/60 focus:border-red-500'
                                        : 'border-neutral-700 focus:border-orange-500/60'
                                    }`}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 shadow-none text-xs text-neutral-500 hover:text-neutral-300">
                                {showConfirm ? (lang === 'es' ? 'ocultar' : 'hide') : (lang === 'es' ? 'ver' : 'show')}
                            </button>
                        </div>
                        {form.confirm_password && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                {passwordsMatch
                                    ? lang === 'es' ? '✅ Las contraseñas coinciden' : '✅ Passwords match'
                                    : lang === 'es' ? '❌ Las contraseñas no coinciden' : '❌ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                {lang === 'es' ? 'Creando cuenta...' : 'Creating account...'}
                            </>
                        ) : (
                            lang === 'es' ? 'Crear cuenta' : 'Create account'
                        )}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-neutral-800" />
                    <span className="text-xs text-neutral-500">{lang === 'es' ? 'o' : 'or'}</span>
                    <div className="flex-1 h-px bg-neutral-800" />
                </div>

                <GoogleLoginButton />
                <p className="text-center text-md text-neutral-400 mt-6">
                    {lang === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}
                    <Link to="/login" className="text-orange-400 font-semibold hover:underline">
                        {lang === 'es' ? 'Inicia sesión' : 'Sign in'}
                    </Link>
                </p>
            </div>

            {showModal && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 px-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                        <div className="text-5xl">🎉</div>
                        <h3 className="text-xl font-bold text-white">
                            {lang === 'es' ? '¡Cuenta creada!' : 'Account created!'}
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            {lang === 'es'
                                ? 'Tu cuenta ha sido creada. Revisa tu correo para ver tus credenciales.'
                                : 'Your account has been created. Check your email for your credentials.'}
                        </p>
                        <button
                            onClick={handleModalClose}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            {lang === 'es' ? 'Ir al login' : 'Go to login'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register