import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { changePassword, requestEmailChange } from '../../services/authService'
import useLang from '../../hooks/useLang'

const t = {
    en: {
        title: '👤 Profile',
        usernameSection: 'Username',
        emailSection: 'Change email',
        passwordSection: 'Change password',
        currentEmail: 'Current email',
        newEmail: 'New email',
        confirmWithPassword: 'Confirm with your current password',
        sendConfirmation: 'Send confirmation email',
        emailPending: '📬 Confirmation email sent to',
        emailPendingNote: 'Click the link in the email to confirm the change.',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        updatePassword: 'Update password',
        passwordMatch: '✅ Passwords match',
        passwordNoMatch: '❌ Passwords do not match',
        forgotPassword: 'Forgot your password?',
    },
    es: {
        title: '👤 Perfil',
        usernameSection: 'Nombre de usuario',
        emailSection: 'Cambiar correo',
        passwordSection: 'Cambiar contraseña',
        currentEmail: 'Correo actual',
        newEmail: 'Nuevo correo',
        confirmWithPassword: 'Confirma con tu contraseña actual',
        sendConfirmation: 'Enviar correo de confirmación',
        emailPending: '📬 Correo de confirmación enviado a',
        emailPendingNote: 'Haz clic en el enlace del correo para confirmar el cambio.',
        currentPassword: 'Contraseña actual',
        newPassword: 'Nueva contraseña',
        confirmPassword: 'Confirmar nueva contraseña',
        updatePassword: 'Actualizar contraseña',
        passwordMatch: '✅ Las contraseñas coinciden',
        passwordNoMatch: '❌ Las contraseñas no coinciden',
        forgotPassword: '¿Olvidaste tu contraseña?',
    }
}

const SuccessMsg = ({ msg }) => (
    <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">{msg}</div>
)
const ErrorMsg = ({ msg }) => (
    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">⚠️ {msg}</div>
)

const Profile = () => {
    const { user } = useAuth()
    const lang = useLang()
    const tx = t[lang]

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
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

            <h1 className="text-2xl font-bold text-white drop-shadow">{tx.title}</h1>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{tx.usernameSection}</h2>
                <p className="text-sm text-gray-500 mb-4">@{user?.username}</p>
                <div className="text-sm text-gray-400">
                    {lang === 'es' ? 'El cambio de nombre de usuario no está disponible por ahora.' : 'Username changes are not available at the moment.'}
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{tx.emailSection}</h2>
                <p className="text-sm text-gray-500 mb-4">{tx.currentEmail}: <span className="font-medium text-gray-700">{user?.email}</span></p>

                {emailSuccess && <SuccessMsg msg={emailSuccess} />}
                {emailError && <ErrorMsg msg={emailError} />}

                {emailPending ? (
                    <div className="bg-indigo-50 text-indigo-700 text-sm px-4 py-3 rounded-xl">
                        <p className="font-semibold">{tx.emailPending} {emailPending}</p>
                        <p className="mt-1 text-indigo-500">{tx.emailPendingNote}</p>
                    </div>
                ) : (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">{tx.newEmail}</label>
                            <input
                                type="email"
                                value={emailForm.new_email}
                                onChange={e => setEmailForm({ ...emailForm, new_email: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">{tx.confirmWithPassword}</label>
                            <input
                                type="password"
                                value={emailForm.password}
                                onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={emailLoading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                        >
                            {emailLoading ? '...' : tx.sendConfirmation}
                        </button>
                    </form>
                )}
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{tx.passwordSection}</h2>

                {passwordSuccess && <SuccessMsg msg={passwordSuccess} />}
                {passwordError && <ErrorMsg msg={passwordError} />}

                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">{tx.currentPassword}</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={passwordForm.current_password}
                                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0">
                                {showCurrent ? '🫣' : '🥕'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">{tx.newPassword}</label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={passwordForm.new_password}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
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
                        <label className="text-sm font-medium text-gray-700 mb-1 block">{tx.confirmPassword}</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={passwordForm.confirm_password}
                                onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                required
                                className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:bg-white transition ${passwordForm.confirm_password
                                        ? passwordsMatch
                                            ? 'border-green-400 focus:border-green-400'
                                            : 'border-red-400 focus:border-red-400'
                                        : 'border-gray-200 focus:border-indigo-400'
                                    }`}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0">
                                {showConfirm ? '🫣' : '🥕'}
                            </button>
                        </div>
                        {passwordForm.confirm_password && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                {passwordsMatch ? tx.passwordMatch : tx.passwordNoMatch}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none disabled:opacity-60"
                    >
                        {passwordLoading ? '...' : tx.updatePassword}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    <a href="/forgot-password" className="text-indigo-400 hover:underline">{tx.forgotPassword}</a>
                </p>
            </div>
        </div>
    )
}

export default Profile