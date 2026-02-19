import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "black");
    return () => {
      document.documentElement.setAttribute("data-theme", "white");
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="h-full flex flex-col items-center gap-40 bg-base-100">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "linear" }}
        className="flex items-center justify-between gap-4 w-full max-w-4xl p-4 min-h-12"
      >
        <h2 className="text-xl font-light text-white tracking-tighter">
          tepidolacuenta
        </h2>
        <Link to="/login" className="btn btn-secondary">
          Ingresar
        </Link>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "linear" }}
        className="text-center max-w-2xl w-full"
        style={{ textShadow: "0 0 40px rgba(190, 242, 100, 0.6)" }}
      >
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl  font-extrabold tracking-tight mb-4 sm:mb-6">
          Pedir la cuenta
          <span className="text-lime-300 block">ahora es más simple</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-base-content mb-6 sm:mb-8 px-2">
          Gestiona las solicitudes de tus mesas en tiempo real.
        </p>
        <motion.button
          onClick={handleGetStarted}
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="btn btn-primary btn-xl"
        >
          {isAuthenticated ? "Ir al Dashboard" : "Comenzar"}
        </motion.button>
      </motion.div>
    </div>
  );
};
