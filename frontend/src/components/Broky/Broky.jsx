import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useLang from '../../hooks/useLang'
import BrokyIntroModal from './BrokyIntroModal'
import BrokyChatModal from './BrokyChatModal'

const Broky = () => {
    const { isPremium } = useAuth()
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    const lang = useLang()

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-white shadow-2xl border-4 border-green-400 hover:scale-110 transition active:scale-95 flex items-center justify-center text-3xl"
                aria-label="Broky"
            >
                <span style={{ filter: 'grayscale(1) sepia(1) saturate(4) brightness(0.9) hue-rotate(-10deg)' }}>
                    🥦
                </span>
            </button>

            {modalOpen && (
                isPremium
                    ? <BrokyChatModal onClose={() => setModalOpen(false)} />
                    : <BrokyIntroModal onClose={() => setModalOpen(false)} onUpgrade={() => { setModalOpen(false); navigate('/premium') }} />
            )}
        </>
    )
}

export default Broky