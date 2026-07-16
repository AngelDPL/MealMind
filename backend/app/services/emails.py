import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

FROM = "MealMind <noreply@mealmind.cc>"

BG_DARK = "#171717"
BG_CARD = "#262626"
BORDER = "#404040"
ORANGE = "#f97316"
TEXT_LIGHT = "#f5f5f5"
TEXT_MUTED = "#a3a3a3"


def send_welcome_email(user_email, username, password_plain):
    resend.Emails.send(
        {
            "from": FROM,
            "to": [user_email],
            "subject": "Welcome to MealMind / Bienvenido a MealMind",
            "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; background: {BG_DARK}; border-radius: 10px;">
            <h2 style="color: {ORANGE};">Welcome to MealMind, {username}! 🥦</h2>
            <p style="color: {TEXT_LIGHT};">Your account has been created successfully. Here are your credentials:</p>
            <div style="background: {BG_CARD}; padding: 20px; border-radius: 8px; border-left: 4px solid {ORANGE};">
                <p style="color: {TEXT_LIGHT}; margin: 0 0 8px;"><strong>📧 Email:</strong> {user_email}</p>
                <p style="color: {TEXT_LIGHT}; margin: 0;"><strong>🔑 Password:</strong> {password_plain}</p>
            </div>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">
                For security reasons, we recommend changing your password from your profile settings.
            </p>
            <hr style="border: none; border-top: 1px solid {BORDER}; margin: 24px 0;">
            <h2 style="color: {ORANGE};">¡Bienvenido a MealMind, {username}! 🥦</h2>
            <p style="color: {TEXT_LIGHT};">Tu cuenta ha sido creada con éxito. Aquí están tus credenciales:</p>
            <div style="background: {BG_CARD}; padding: 20px; border-radius: 8px; border-left: 4px solid {ORANGE};">
                <p style="color: {TEXT_LIGHT}; margin: 0 0 8px;"><strong>📧 Correo:</strong> {user_email}</p>
                <p style="color: {TEXT_LIGHT}; margin: 0;"><strong>🔑 Contraseña:</strong> {password_plain}</p>
            </div>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">
                Por seguridad, te recomendamos cambiar tu contraseña desde tu perfil.
            </p>
        </div>
        """,
        }
    )


def send_email_change_confirmation(pending_email, username, token):
    confirm_url = f"https://mealmind.cc/confirm-email?token={token}"
    resend.Emails.send(
        {
            "from": FROM,
            "to": [pending_email],
            "subject": "✉️ Confirm your new email / Confirma tu nuevo correo — MealMind",
            "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; background: {BG_DARK}; border-radius: 10px;">
            <h2 style="color: {ORANGE};">Confirm your new email</h2>
            <p style="color: {TEXT_LIGHT};">Hi <strong>{username}</strong>, we received a request to change the email address on your MealMind account.</p>
            <a href="{confirm_url}" style="display: inline-block; background: {ORANGE}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Confirm new email
            </a>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">If you did not request this change, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid {BORDER}; margin: 24px 0;">
            <h2 style="color: {ORANGE};">Confirma tu nuevo correo</h2>
            <p style="color: {TEXT_LIGHT};">Hola <strong>{username}</strong>, recibimos una solicitud para cambiar el correo de tu cuenta MealMind.</p>
            <a href="{confirm_url}" style="display: inline-block; background: {ORANGE}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Confirmar nuevo correo
            </a>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
        """,
        }
    )


def send_password_reset_email(user_email, username, token):
    reset_url = f"https://mealmind.cc/reset-password?token={token}"
    resend.Emails.send(
        {
            "from": FROM,
            "to": [user_email],
            "subject": "🔐 Reset your password / Restablecer contraseña — MealMind",
            "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; background: {BG_DARK}; border-radius: 10px;">
            <h2 style="color: {ORANGE};">Reset your password</h2>
            <p style="color: {TEXT_LIGHT};">Hi <strong>{username}</strong>, we received a request to reset the password on your MealMind account.</p>
            <a href="{reset_url}" style="display: inline-block; background: {ORANGE}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Reset password
            </a>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid {BORDER}; margin: 24px 0;">
            <h2 style="color: {ORANGE};">Restablece tu contraseña</h2>
            <p style="color: {TEXT_LIGHT};">Hola <strong>{username}</strong>, recibimos una solicitud para cambiar la contraseña de tu cuenta MealMind.</p>
            <a href="{reset_url}" style="display: inline-block; background: {ORANGE}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Cambiar contraseña
            </a>
            <p style="color: {TEXT_MUTED}; font-size: 12px; margin-top: 10px;">Si no solicitaste esto, ignora este correo.</p>
        </div>
        """,
        }
    )