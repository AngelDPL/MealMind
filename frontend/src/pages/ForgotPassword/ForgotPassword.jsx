import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../services/authService'
import useLang from '../../hooks/useLang'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const lang = useLang()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await forgotPassword({ email })
            setSent(true)
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
                {sent ? (
                    <div className="text-center flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {lang === 'es' ? '¡Correo enviado!' : 'Email sent!'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {lang === 'es'
                                ? 'Si ese correo existe, recibirás un enlace para restablecer tu contraseña.'
                                : 'If that email exists, you will receive a reset link shortly.'}
                        </p>
                        <Link to="/login" className="text-indigo-500 text-sm hover:underline">
                            {lang === 'es' ? '← Volver al login' : '← Back to login'}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">🔐</div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {lang === 'es'
                                    ? 'Introduce tu correo y te enviaremos un enlace.'
                                    : 'Enter your email and we\'ll send you a reset link.'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {lang === 'es' ? 'Correo electrónico' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                            >
                                {loading ? '...' : lang === 'es' ? 'Enviar enlace' : 'Send reset link'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-400 mt-4">
                            <Link to="/login" className="text-indigo-500 hover:underline">
                                {lang === 'es' ? '← Volver al login' : '← Back to login'}
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword