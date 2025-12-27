import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link if you want to link to Login
import { signupUser } from "../api/auth";
import Swal from "sweetalert2"; // Import SweetAlert2

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // We removed the 'error' state variable because we will use a Pop-up for errors now.
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signupUser({ name, email, password });

      if (res.success) {
        // SUCCESS POP-UP
        Swal.fire({
          title: 'Welcome to SkillSync!',
          text: 'Account created successfully.',
          icon: 'success',
          background: '#1a1a2e', // Dark background for modal
          color: '#ffffff', // White text
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#e94560' // Accent color
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        // ERROR POP-UP (API Error)
        Swal.fire({
          title: 'Oops...',
          text: res.message || "Signup failed. Please try again.",
          icon: 'error',
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#e94560'
        });
      }
    } catch (err) {
      // NETWORK/SYSTEM ERROR POP-UP
      Swal.fire({
        title: 'Network Error',
        text: 'Something went wrong. Check your connection.',
        icon: 'error',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#e94560'
      });
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join the hackathon revolution</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Sign Up
          </button>
        </form>
        
        {/* Optional: Link to login if they already have an account */}
        <p className="footer-text">
          Already have an account? <span className="link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;