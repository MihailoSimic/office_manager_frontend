import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/checkToken", {
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
          // logout na backend-u
          await fetch("http://localhost:8000/user/logout", {
            method: "POST",
            credentials: "include",
          });

          // prikaži swal poruku
          await Swal.fire({
            icon: "error",
            title: "Nedozvoljen pristup",
            text: "Vaša sesija je istekla ili nemate potrebnu rolu.",
            confirmButtonText: "U redu",
          });

          // tek nakon što korisnik zatvori alert → preusmeri
          navigate("/login");
        }
      } catch (err) {
        console.error("Greška prilikom validacije tokena:", err);
        try {
          await fetch("http://localhost:8000/user/logout", {
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
          confirmButtonText: "U redu",
        });

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, []);

  if (loading) return <p>Loading...</p>;
  return allowed ? children : null;
};

export default ProtectedRoute;
