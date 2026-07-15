import useLang from '../../hooks/useLang'

const BrokyIntroModal = ({ onClose, onUpgrade }) => {
    const lang = useLang()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center flex flex-col gap-4">
                <span className="text-5xl mx-auto" style={{ filter: 'grayscale(1) sepia(1) saturate(4) brightness(0.9) hue-rotate(-10deg)' }}>
                    🥦
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                    {lang === 'es' ? '¡Hola, soy Broky!' : "Hi, I'm Broky!"}
                </h2>
                <p className="text-gray-600 text-lg">
                    {lang === 'es'
                        ? 'Puedo crear tu plan de comidas al instante: solo hoy, toda la semana, o los días que tú elijas.'
                        : 'I can build your meal plan instantly: just today, the whole week, or whichever days you pick.'}
                </p>

                <div className="bg-gray-200 rounded-xl p-4 text-left text-lg text-gray-900 flex flex-col gap-2">
                    <p>{lang === 'es' ? 'Respeto tus calorías máximas por comida.' : 'I respect your max calories per meal.'}</p>
                    <p>{lang === 'es' ? 'Uso los ingredientes que prefieras.' : 'I use your preferred ingredients.'}</p>
                    <p>{lang === 'es' ? 'Nunca incluyo tus alergias.' : 'I never include your allergies.'}</p>
                </div>

                <button
                    onClick={onUpgrade}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                >
                    {lang === 'es' ? 'Hazte Premium para hablar conmigo' : 'Go Premium to chat with me'}
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition border-none"
                >
                    {lang === 'es' ? 'Ahora no' : 'Not now'}
                </button>
            </div>
        </div>
    )
}

export default BrokyIntroModal