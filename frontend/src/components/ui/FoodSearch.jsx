import { useState, useRef, useEffect } from 'react'
import { searchFoods } from '../../services/foodService'


const FoodSearch = ({ onSelect}) => {

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const ref = useRef(null)


    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setOpen(false)
            return
        }
        const timeout = setTimeout(async () => {
            setLoading(true)
            try {
                const data = await searchFoods(query)
                setResults(data)
                setOpen(true)
            } catch {
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [query])

    const handleSelect = (food) => {
        onSelect(food)
        setQuery('')
        setResults([])
        setOpen(false)
    }

    return (
        <div ref={ref} className="relative">
            <input
                type="text"
                placeholder="🔍 Search ingredient..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
            />

            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            )}

            {open && results.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {results.map(food => (
                        <button
                            key={food.id}
                            type="button"
                            onClick={() => handleSelect(food)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition border-none shadow-none rounded-none"
                        >
                            <span className="font-medium text-gray-800">{food.name}</span>
                            <span className="text-gray-400 text-xs ml-2">
                                🔥 {food.calories} · 💪 {food.protein}g · 🍞 {food.carbs}g · 🧈 {food.fat}g
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {open && results.length === 0 && !loading && query.trim() && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3 text-sm text-gray-400">
                    No ingredients found for "{query}"
                </div>
            )}
        </div>
    )
}

export default FoodSearch