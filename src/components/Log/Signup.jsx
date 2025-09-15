import React, { useState } from "react";
import { auth, db } from "../../config/Firebaseconfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Loading from "../Loading";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // ✅ username state
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // translation dictionary
  const translations = {
    en: {
      haveAccount: "already have an account?",
      login: "Login",
      create: "Create an account",
      username: "Username",
      email: "Email",
      password: "Password",
      signup: "Signup",
      or: "Or",
      google: "Continue with Google",
    },
    fr: {
      haveAccount: "vous avez déjà un compte ?",
      login: "Connexion",
      create: "Créer un compte",
      username: "Nom d'utilisateur",
      email: "E-mail",
      password: "Mot de passe",
      signup: "S'inscrire",
      or: "Ou",
      google: "Continuer avec Google",
    },
    es: {
      haveAccount: "¿ya tienes una cuenta?",
      login: "Iniciar sesión",
      create: "Crear una cuenta",
      username: "Nombre de usuario",
      email: "Correo electrónico",
      password: "Contraseña",
      signup: "Registrarse",
      or: "O",
      google: "Continuar con Google",
    },
    de: {
      haveAccount: "bereits ein Konto?",
      login: "Anmelden",
      create: "Konto erstellen",
      username: "Benutzername",
      email: "E-Mail",
      password: "Passwort",
      signup: "Registrieren",
      or: "Oder",
      google: "Weiter mit Google",
    },
    ar: {
      haveAccount: "هل لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      create: "إنشاء حساب",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signup: "إنشاء حساب",
      or: "أو",
      google: "متابعة باستخدام Google",
    },
  };

  // Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        bio: "",
        profilePic: "",
        createdAt: serverTimestamp(),
      });

      // save username locally
      localStorage.setItem("username", username);
      alert("Signup successful!");
      console.log("User signed up:", user);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || "",
          email: user.email,
          bio: "",
          profilePic: user.photoURL || "",
          createdAt: serverTimestamp(),
        });

        localStorage.setItem("username", user.displayName || "");
      }

      alert("Signup successful!");
      console.log("Google signup success:", user);
      navigate("/profile");
    } catch (err) {
      console.error("Google signup error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
  return <Loading />;
}
  return (
    <>
    <main className="back  bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header Row */}
      <div className="flex text-white flex-col sm:flex-row items-center justify-between gap-2 w-full px-3 sm:px-6 py-3">
        {/* Language selection */}
        <div className="w-full sm:w-auto flex justify-start sm:justify-center">
          <select
            className="border rounded p-1.5  w-full sm:w-auto"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en" className="text-gray-500">English</option>
            <option value="fr" className="text-gray-500">Français</option>
            <option value="es" className="text-gray-500">Español</option>
            <option value="de" className="text-gray-500">Deutsch</option>
            <option value="ar" className="text-gray-500">العربية</option>
          </select>
        </div>

        {/* Already have account */}
        <div className="flex items-center capitalize gap-1.5 text-sm sm:text-base">
          <p>{translations[language].haveAccount}</p>
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            {translations[language].login}
          </Link>
        </div>
      </div>

      {/* Signup Section */}
      <section className="flex  justify-center items-center min-h-screen px-3 sm:px-6 md:px-10">
        <div className=" bg-white/10 backdrop-blur-xl py-6 px-4 sm:px-6 md:px-8 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] rounded-2xl flex flex-col justify-center shadow-md">
          <div className="w-full flex flex-col">
            <h2 className="text-center text-white font-semibold font-sans acct text-[1.75rem] sm:text-[2rem] pb-3">
              {translations[language].create}
            </h2>
            {error && (
              <p className="text-red-500 pb-2 text-center text-sm sm:text-base">{error}</p>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="w-full flex flex-col items-center">
              {/* Username */}
              <div className=" text-white block mb-3 w-full sm:w-[90%]">
                <label>{translations[language].username}</label>
                <input
                  type="text"
                  placeholder={translations[language].username}
                  className="border mt-3 p-2 rounded-[10px] w-full  bg-white/20 text-white placeholder-gray-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className=" text-white block mb-3 w-full sm:w-[90%]">
                <label>{translations[language].email}</label>
                <input
                  type="email"
                  placeholder={translations[language].email}
                 className="border mt-3 p-2 rounded-[10px] w-full  bg-white/20 text-white placeholder-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
             <div className=" text-white block mb-3 w-full sm:w-[90%]">
                <label>{translations[language].password}</label>
                <input
                  type="password"
                  placeholder={translations[language].password}
                  className="border mt-3 p-2 rounded-[10px] w-full  bg-white/20 text-white placeholder-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="  bg-gradient-to-r from-indigo-500 to-pink-500 w-full sm:w-[90%] bg-blue-500 text-white p-2.5 mt-5 rounded-3xl font-semibold text-base sm:text-lg">
                {translations[language].signup}
              </button>
            </form>

            {/* OR Divider */}
            <div className="w-full flex flex-col items-center">
              <div className="flex justify-center uppercase text-white items-center gap-3 mt-5 w-[90%]">
                <span className="border flex-1 h-0"></span>
                <p className="text-sm sm:text-base">{translations[language].or}</p>
                <span className="border flex-1 h-0"></span>
              </div>

              {/* Google Signup */}
              <button
                onClick={handleGoogleSignup}
                className="flex items-center gap-3 border-2 w-full sm:w-[90%] p-2.5 mt-5 rounded-3xl justify-center text-white"
              >
                <FcGoogle className="text-lg sm:text-xl" />
                <p className="text-sm sm:text-base">{translations[language].google}</p>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
       </>
  );
};

export default Signup;
