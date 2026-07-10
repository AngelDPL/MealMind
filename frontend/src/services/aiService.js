import { get, post, put, del } from './api'

export const generateMealPlan = async (data) => post('/ai/generate-plan', data)

export const saveAIPlan = async (data) => post('/ai/plans', data)

export const getAIPlans = async () => get('/ai/plans')

export const deleteAIPlan = async (id) => del(`/ai/plans/${id}`)

export const getPreferences = async () => get('/ai/preferences')

export const updatePreferences = async (data) => put('/ai/preferences', data)