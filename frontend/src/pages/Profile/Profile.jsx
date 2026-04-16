import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateInfo, changePassword } from '../../services/authService'

const Profile = () => {
    const { user, loginUser } = useAuth()
    const [infoForm, setInfoForm] = useState({ username: user?.username || '', email: user?.email || '' })
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
    const [infoSuccess, setInfoSuccess] = useState('')
    const [infoError, setInfoError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const handleInfoSubmit = async (e) => {
        e.preventDefault()
        setInfoError('')
        setInfoSuccess('')
        try {
            const data = await updateInfo(infoForm)
            setInfoSuccess('Profile updated successfully')
            loginUser(
                localStorage.getItem('token') || sessionStorage.getItem('token'),
                data.user,
                !!localStorage.getItem('token')
            )
        } catch (err) {
            setInfoError(err.message)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordError('Passwords do not match')
            return
        }
        try {
            await changePassword({
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password
            })
            setPasswordSuccess('Password updated successfully')
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
        } catch (err) {
            setPasswordError(err.message)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

            <h1 className="text-2xl font-bold text-white drop-shadow">👤 Profile</h1>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Personal info</h2>

                {infoSuccess && (
                    <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
                        {infoSuccess}
                    </div>
                )}
                {infoError && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                        {infoError}
                    </div>
                )}

                <form onSubmit={handleInfoSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
                        <input
                            type="text"
                            value={infoForm.username}
                            onChange={e => setInfoForm({ ...infoForm, username: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={infoForm.email}
                            onChange={e => setInfoForm({ ...infoForm, email: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                    >
                        Save changes
                    </button>
                </form>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Change password</h2>

                {passwordSuccess && (
                    <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
                        {passwordSuccess}
                    </div>
                )}
                {passwordError && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Current password</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordForm.current_password}
                                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0"
                            >
                                {showCurrentPassword ? '🫣' : '🥕'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">New password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordForm.new_password}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none p-0"
                            >
                                {showNewPassword ? '🫣' : '🥕'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm new password</label>
                        <input
                            type="password"
                            value={passwordForm.confirm_password}
                            onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                    >
                        Update password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile