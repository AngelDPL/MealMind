const BASE_URL = import.meta.env.VITE_API_URL || '/api'
console.log('API URL:', import.meta.env.VITE_API_URL)
const getHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}`})
    }
}

const handleResponse = async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
}

export const get = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(),
    })
    return handleResponse(res)
}

export const post = async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    })
    return handleResponse(res)
}

export const put = async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body)
    })
    return handleResponse(res)
}

export const patch = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders()
    })
    return handleResponse(res)
}

export const del = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders()
    })
    return handleResponse(res)
}

