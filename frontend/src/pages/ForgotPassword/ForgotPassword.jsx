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
                {sent ? (
                    <div className="text-center flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-white">
                            {lang === 'es' ? '¡Correo enviado!' : 'Email sent!'}
                        </h2>
                        <p className="text-neutral-400 text-sm">
                            {lang === 'es'
                                ? 'Si ese correo existe, recibirás un enlace para restablecer tu contraseña.'
                                : 'If that email exists, you will receive a reset link shortly.'}
                        </p>
                        <Link to="/login" className="text-orange-400 text-sm hover:underline">
                            {lang === 'es' ? '← Volver al login' : '← Back to login'}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">🔐</div>
                            <h2 className="text-2xl font-bold text-white">
                                {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
                            </h2>
                            <p className="text-neutral-400 text-sm mt-1">
                                {lang === 'es'
                                    ? 'Introduce tu correo y te enviaremos un enlace.'
                                    : 'Enter your email and we\'ll send you a reset link.'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-300 mb-1 block">
                                    {lang === 'es' ? 'Correo electrónico' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl text-sm bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                            >
                                {loading ? '...' : lang === 'es' ? 'Enviar enlace' : 'Send reset link'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-neutral-500 mt-4">
                            <Link to="/recipes" className="text-orange-400 hover:underline">
                                {lang === 'es' ? '← Volver a recetas' : '← Back to recipes'}
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword