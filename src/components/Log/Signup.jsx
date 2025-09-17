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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const translations = {
    en: {
      haveAccount: "Already have an account?",
      login: "Login",
      create: "Create an account",
      username: "Username",
      email: "Email",
      password: "Password",
      signup: "Sign up",
      or: "Or",
      google: "Continue with Google",
    },
    fr: {
      haveAccount: "Vous avez déjà un compte ?",
      login: "Connexion",
      create: "Créer un compte",
      username: "Nom d'utilisateur",
      email: "E-mail",
      password: "Mot de passe",
      signup: "S'inscrire",
      or: "Ou",
      google: "Continuer avec Google",
    },
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username,
        bio: "",
        profilePic: "",
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("username", username);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <select
            className="border rounded-md p-2 text-sm dark:bg-gray-700 dark:text-gray-200"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            {translations[language].haveAccount}{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              {translations[language].login}
            </Link>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {translations[language].create}
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              {translations[language].username}
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              {translations[language].email}
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              {translations[language].password}
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            {translations[language].signup}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <span className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></span>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            {translations[language].or}
          </span>
          <span className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></span>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FcGoogle size={20} /> {translations[language].google}
        </button>
      </div>
    </main>
  );
};

export default Signup;
