import { get, post } from './api.js'

export const createCheckoutSession = async () => post('/subscription/create-checkout-session')

export const createPortalSession = async () => post('/subscription/create-portal-session')

export const getSubscriptionStatus = async () => get('/subscription/status')