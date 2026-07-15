import os
import stripe
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from app.extensions import db, limiter
from app.models import User, Subscription

stripe_webhook_bp = Blueprint("stripe_webhook", __name__)

WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


@stripe_webhook_bp.route("/webhook", methods=["POST"])
@limiter.exempt
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        return jsonify({"error": "Invalid signature"}), 400

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        _handle_checkout_completed(data)

    elif event_type == "customer.subscription.updated":
        _handle_subscription_updated(data)

    elif event_type == "customer.subscription.deleted":
        _handle_subscription_deleted(data)

    elif event_type == "invoice.payment_failed":
        _handle_payment_failed(data)

    return jsonify({"received": True}), 200


def _get_period_end(stripe_sub):
    items = stripe_sub["items"]["data"]
    if items:
        return items[0]["current_period_end"]
    return None


def _handle_checkout_completed(session):
    user_id = session["client_reference_id"]
    if not user_id:
        return

    user = User.query.get(int(user_id))
    if not user:
        return

    stripe_subscription_id = session["subscription"]
    stripe_customer_id = session["customer"]

    stripe_sub = stripe.Subscription.retrieve(stripe_subscription_id)

    subscription = user.subscription
    if not subscription:
        subscription = Subscription(user_id=user.id)
        db.session.add(subscription)

    period_end = _get_period_end(stripe_sub)

    subscription.stripe_customer_id = stripe_customer_id
    subscription.stripe_subscription_id = stripe_subscription_id
    subscription.status = stripe_sub["status"]
    subscription.current_period_end = (
        datetime.fromtimestamp(period_end) if period_end else None
    )
    subscription.trial_end = (
        datetime.fromtimestamp(stripe_sub["trial_end"])
        if stripe_sub["trial_end"]
        else None
    )

    db.session.commit()


def _handle_subscription_updated(stripe_sub):
    subscription = Subscription.query.filter_by(
        stripe_subscription_id=stripe_sub["id"]
    ).first()
    if not subscription:
        return

    period_end = _get_period_end(stripe_sub)

    subscription.status = stripe_sub["status"]
    subscription.current_period_end = datetime.fromtimestamp(period_end) if period_end else None
    subscription.trial_end = (
        datetime.fromtimestamp(stripe_sub["trial_end"]) if stripe_sub["trial_end"] else None
    )

    if stripe_sub["status"] != "past_due":
        subscription.past_due_since = None

    db.session.commit()


def _handle_subscription_deleted(stripe_sub):
    subscription = Subscription.query.filter_by(
        stripe_subscription_id=stripe_sub["id"]
    ).first()
    if not subscription:
        return

    subscription.status = "canceled"
    db.session.commit()


def _handle_payment_failed(invoice):
    stripe_subscription_id = invoice["subscription"] if "subscription" in invoice else None
    if not stripe_subscription_id:
        return

    subscription = Subscription.query.filter_by(
        stripe_subscription_id=stripe_subscription_id
    ).first()
    if not subscription:
        return

    if subscription.status != "past_due":
        subscription.past_due_since = datetime.now(timezone.utc)
    subscription.status = "past_due"
    db.session.commit()
