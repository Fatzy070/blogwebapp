import React, { useState } from "react";
import { auth, db } from "../../config/Firebaseconfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Loading from "../Loading";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const translations = {
    en: {
      dontHave: "Don’t have an account?",
      signup: "Signup",
      login: "Login",
      email: "Email or Username",
      password: "Password",
      or: "Or",
      google: "Continue with Google",
      forgot: "Forgot Password?",
    },
    fr: {
      dontHave: "Vous n’avez pas de compte ?",
      signup: "Créer un compte",
      login: "Connexion",
      email: "E-mail ou Nom d'utilisateur",
      password: "Mot de passe",
      or: "Ou",
      google: "Continuer avec Google",
      forgot: "Mot de passe oublié ?",
    },
    es: {
      dontHave: "¿No tienes una cuenta?",
      signup: "Registrarse",
      login: "Iniciar sesión",
      email: "Correo electrónico o Nombre de usuario",
      password: "Contraseña",
      or: "O",
      google: "Continuar con Google",
      forgot: "¿Olvidaste tu contraseña?",
    },
    de: {
      dontHave: "Noch kein Konto?",
      signup: "Registrieren",
      login: "Anmelden",
      email: "E-Mail oder Benutzername",
      password: "Passwort",
      or: "Oder",
      google: "Weiter mit Google",
      forgot: "Passwort vergessen?",
    },
    ar: {
      dontHave: "ليس لديك حساب؟",
      signup: "إنشاء حساب",
      login: "تسجيل الدخول",
      email: "البريد الإلكتروني أو اسم المستخدم",
      password: "كلمة المرور",
      or: "أو",
      google: "متابعة باستخدام Google",
      forgot: "هل نسيت كلمة المرور؟",
    },
  };

  // Normal email/username login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let loginEmail = identifier;

      // check if it's an email
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(identifier)) {
        // if not email, assume it's username → fetch email from Firestore
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          loginEmail = querySnapshot.docs[0].data().email;
        } else {
          setError("Username not found");
          return;
        }
      }

      const userCred = await signInWithEmailAndPassword(auth, loginEmail, password );

      const currentUser = userCred.user
      const userDoc = await getDoc(doc(db , "users" , currentUser.uid))
      if(userDoc.exists()){
        const userData = userDoc.data()

        localStorage.setItem("user" , JSON.stringify(userData))
      }
      alert("Login successful!");
      console.log("Logged in:", userCred.user);
      navigate("/profile");



    } catch (err) {
    switch (err.code) {
      case "auth/wrong-password":
        setError("Incorrect password");
        break;
      case "auth/user-not-found":
        setError("No user found with this email");
        break;
      default:
        setError("Login failed. Try again.");
    }
   } finally {
      setLoading(false)
    };
  }
  // Google login
  const handleGoogleLogin = async () => {
    setLoading(true)
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
      }
      alert("Login successful!");
      console.log("Google login success:", user);
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err.message);
      setError(err.message);
    }finally {
      setLoading(false)
    }
  };

  if (loading) {
  return <Loading />;
}
  return (
    
    <>
    <main className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
    
      {/* Top Bar with language + signup link */}
      <div className="flex  flex-col sm:flex-row items-center justify-between gap-3 w-full px-3 py-3">
        <div>
          <select
            className="border rounded p-1.5 text-white text-sm sm:text-base"
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

        <div className="flex text-white items-center gap-1.5 text-sm sm:text-base">
          <p>{translations[language].dontHave}</p>
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium"
          >
            {translations[language].signup}
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <section className="flex  justify-center items-center min-h-[80vh] px-3 sm:px-6 md:px-10">
        <div className="bg-white/10 backdrop-blur-xl  py-6 px-4 sm:px-6 md:px-8 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] rounded-2xl flex flex-col justify-center shadow-2xl">
          <div className="w-full flex flex-col">
            <h2 className="text-white text-center font-semibold font-sans text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] pb-3">
              {translations[language].login}
            </h2>
            {error && (
              <p className="text-red-500 pb-2 text-center text-sm sm:text-base">
                {error}
              </p>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className="w-full flex flex-col items-center"
            >
              <div className="block text-white mb-3 w-full sm:w-[90%]">
                <label className="text-sm sm:text-base">
                  {translations[language].email}
                </label>
                <input
                  type="text"
                  placeholder={translations[language].email}
                  className="border mt-3 bg-white/20 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="block text-white mb-3 w-full sm:w-[90%]">
                <label className="text-sm sm:text-base">
                  {translations[language].password}
                </label>
                <input
                  type="password"
                  placeholder={translations[language].password}
                   className="border mt-3 bg-white/20 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="w-full sm:w-[90%] bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-2.5 mt-5 rounded-3xl font-semibold text-sm sm:text-base transition-all">
                {translations[language].login}
              </button>
            </form>

            {/* Forgot Password */}
            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-white hover:underline text-sm sm:text-base"
              >
                {translations[language].forgot}
              </Link>
            </div>

            {/* OR Divider */}
            <div className="w-full flex flex-col items-center">
              <div className="flex justify-center uppercase text-white items-center gap-3 mt-5 w-[90%]">
                <span className="border flex-1 h-0"></span>
                <p className="text-sm sm:text-base">
                  {translations[language].or}
                </p>
                <span className="border flex-1 h-0"></span>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-3 border-2 w-full sm:w-[90%] p-2.5 mt-5 rounded-3xl justify-center text-white transition-all"
              >
                <FcGoogle className="text-lg sm:text-xl" />
                <p className="text-sm sm:text-base font-medium">
                  {translations[language].google}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default Login;
