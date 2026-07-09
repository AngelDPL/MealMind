import os
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

PREMIUM_PRICE_ID = os.getenv("STRIPE_PREMIUM_PRICE_ID")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def create_checkout_session(user):
    customer_id = None
    if user.subscription and user.subscription.stripe_customer_id:
        customer_id = user.subscription.stripe_customer_id

    session = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        line_items=[{"price": PREMIUM_PRICE_ID, "quantity": 1}],
        subscription_data={"trial_period_days": 7},
        customer=customer_id,
        customer_email=user.email if not customer_id else None,
        client_reference_id=str(user.id),
        success_url=f"{FRONTEND_URL}/premium/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/premium",
    )
    return session


def create_portal_session(customer_id):
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{FRONTEND_URL}/profile",
    )
    return session