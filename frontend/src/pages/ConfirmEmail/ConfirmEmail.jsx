import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { get } from '../../services/api'

const ConfirmEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        const confirm = async () => {
            const token = searchParams.get('token')
            if (!token) { setStatus('error'); return }
            try {
                await get(`/auth/confirm-email?token=${token}`)
                setStatus('success')
            } catch {
                setStatus('error')
            }
        }
        confirm()
    }, [])

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

            <div className="relative z-10 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-10 h-10 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white">Verifying... / Verificando...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-2">Email updated! / ¡Correo actualizado!</h2>
                        <p className="text-neutral-400 text-sm mb-6">Your email has been changed successfully. / Tu correo ha sido cambiado con éxito.</p>
                        <Link to="/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                            Sign in / Iniciar sesión
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-2">Invalid link / Enlace inválido</h2>
                        <p className="text-neutral-400 text-sm mb-6">The link has expired or is invalid. / El enlace ha expirado o no es válido.</p>
                        <Link to="/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                            Go back / Volver
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default ConfirmEmail