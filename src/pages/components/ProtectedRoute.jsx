import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingScreen from "./LoadingScreen";
import BASE_URL from "../../api/baseUrl";
const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/checkToken`, {
        credentials: "include",
      });
      if (!res.ok) return null;

      const data = await res.json(); // { username, role, message }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const validate = async () => {
      try {
        const result = await checkToken();

        if (result && (!requiredRole || result.role === requiredRole)) {
          setAllowed(true);
        } else {
          await fetch(`${BASE_URL}/user/logout`, {
            method: "POST",
            credentials: "include",
          });

          await Swal.fire({
            icon: "error",
            title: "Nedozvoljen pristup",
            text: "Vaša sesija je istekla ili nemate potrebnu rolu.",
            confirmButtonText: "U redu",
          });

          navigate("/login");
        }
      } catch (err) {
        console.error("Greška prilikom validacije tokena:", err);
        try {
          await fetch(`${BASE_URL}/user/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (e) {
          console.error("Logout nije uspeo:", e);
        }

        await Swal.fire({
          icon: "error",
          title: "Greška",
          text: "Došlo je do problema prilikom provere pristupa.",
          confirmButtonText: "U redu"
        });

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, []);

  if (loading) return <LoadingScreen />;
  return allowed ? children : null;
};

export default ProtectedRoute;
