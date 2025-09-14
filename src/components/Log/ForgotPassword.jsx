import React, { useState } from "react";
import { auth } from "../../config/Firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");

  // translation dictionary
  const translations = {
    en: {
      title: "Forgot Password",
      instruction: "Enter your email and we’ll send you reset instructions.",
      email: "Email",
      reset: "Reset Password",
      backLogin: "Back to Login",
    },
    fr: {
      title: "Mot de passe oublié",
      instruction: "Entrez votre e-mail et nous vous enverrons les instructions.",
      email: "E-mail",
      reset: "Réinitialiser le mot de passe",
      backLogin: "Retour à la connexion",
    },
    es: {
      title: "Olvidé mi contraseña",
      instruction: "Ingrese su correo y le enviaremos las instrucciones.",
      email: "Correo electrónico",
      reset: "Restablecer contraseña",
      backLogin: "Volver al inicio de sesión",
    },
    de: {
      title: "Passwort vergessen",
      instruction: "Geben Sie Ihre E-Mail ein, wir senden Ihnen Anweisungen.",
      email: "E-Mail",
      reset: "Passwort zurücksetzen",
      backLogin: "Zurück zur Anmeldung",
    },
    ar: {
      title: "نسيت كلمة المرور",
      instruction: "أدخل بريدك الإلكتروني وسنرسل لك التعليمات.",
      email: "البريد الإلكتروني",
      reset: "إعادة تعيين كلمة المرور",
      backLogin: "العودة لتسجيل الدخول",
    },
  };

  // handle password reset
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Top bar with language + back to login */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-3 py-3">
        <div>
          <select
            className="border rounded p-1.5 text-gray-600 text-sm sm:text-base"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-sm sm:text-base">
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            {translations[language].backLogin}
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <section className="flex justify-center items-center min-h-[80vh] px-3 sm:px-6 md:px-10">
        <div className="border py-6 px-4 sm:px-6 md:px-8 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] rounded-2xl flex flex-col justify-center shadow-md bg-white">
          <div className="w-full flex flex-col">
            <h2 className="text-center font-semibold font-sans text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] pb-2">
              {translations[language].title}
            </h2>
            <p className="text-center text-gray-500 text-sm sm:text-base mb-4">
              {translations[language].instruction}
            </p>

            {error && (
              <p className="text-red-500 pb-2 text-center text-sm sm:text-base">
                {error}
              </p>
            )}
            {message && (
              <p className="text-green-500 pb-2 text-center text-sm sm:text-base">
                {message}
              </p>
            )}

            {/* Reset Form */}
            <form
              onSubmit={handleReset}
              className="w-full flex flex-col items-center"
            >
              <div className="flex flex-col text-gray-600 gap-2 mb-3 w-full sm:w-[90%]">
                <label className="text-sm sm:text-base">
                  {translations[language].email}
                </label>
                <input
                  type="email"
                  placeholder={translations[language].email}
                  className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="w-full sm:w-[90%] bg-blue-500 hover:bg-blue-600 text-white p-2.5 mt-5 rounded-3xl font-semibold text-sm sm:text-base transition-all">
                {translations[language].reset}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
