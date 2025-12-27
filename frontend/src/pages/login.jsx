import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { setToken } from "../utils/auth";
import Swal from "sweetalert2"; // Import SweetAlert2

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Removed 'error' state, replacing with Pop-up
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      if (res.token) {
        setToken(res.token);
        
        if (res.user) {
            localStorage.setItem("user", JSON.stringify(res.user));
        }

        // SUCCESS POP-UP (Auto-close timer)
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Redirecting to dashboard...',
          background: '#1a1a2e',
          color: '#ffffff',
          timer: 1500, // Closes automatically after 1.5 seconds
          showConfirmButton: false
        }).then(() => {
           navigate("/announcements");
        });

      } else {
        // ERROR POP-UP
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: res.message || "Invalid email or password",
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#e94560'
        });
      }
    } catch (err) {
      // NETWORK ERROR POP-UP
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to server.',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#e94560'
      });
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Login to access your dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-glow" type="submit">
            Login
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <span className="link" onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;