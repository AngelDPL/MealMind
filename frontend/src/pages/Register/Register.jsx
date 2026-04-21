import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/authService'

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '' })
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleKeyDown = (e) => setCapsLock(e.getModifierState('CapsLock'))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirm_password) {
            setError('Passwords do not match')
            return
        }

        try {
            await register(form)
            setShowModal(true)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleModalClose = () => {
        setShowModal(false)
        navigate('/login')
    }

    const passwordsMatch = form.confirm_password && form.password === form.confirm_password

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 " />

            <div className="relative z-10 bg-white/80 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-black">Create account</h2>
                    <p className="text-black text-md mt-1">Start planning your meals</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-black mb-1 block">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="yourname"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                    </div>

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
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 shadow-none"
                            >
                                {showPassword ? '🫣' : '🥕'}
                            </button>
                        </div>
                        {capsLock && passwordFocused && (
                            <p className="text-amber-500 text-md mt-1">Caps Lock is on</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-black mb-1 block">Confirm password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder="••••••••"
                                value={form.confirm_password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                required
                                className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:bg-white transition ${form.confirm_password
                                        ? passwordsMatch
                                            ? 'border-green-400 focus:border-green-400'
                                            : 'border-red-400 focus:border-red-400'
                                        : 'border-gray-200 focus:border-indigo-400'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 shadow-none"
                            >
                                {showConfirm ? '🫣' : '🥕'}
                            </button>
                        </div>
                        {form.confirm_password && (
                            <p className={`text-md mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-center text-md text-black mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-500 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {showModal && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                        <div className="text-5xl">🎉</div>
                        <h3 className="text-xl font-bold text-gray-800">Account created!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your account has been created. Check your email for your credentials.
                        </p>
                        <button
                            onClick={handleModalClose}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Go to login
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register