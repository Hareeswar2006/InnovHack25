import { useState, useRef, useEffect } from "react";
import { verifyRoomCode, requestToJoinRoom } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./joinbycode.css";

function JoinByCode({ onClose }) {
  // CHANGED: 8 characters instead of 6
  const [otp, setOtp] = useState(new Array(8).fill(""));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [previewData, setPreviewData] = useState(null);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // --- INPUT HANDLERS ---
  const handleChange = (element, index) => {
    const val = element.value;
    
    // VALIDATION: Allow only Alphanumeric (Letters & Numbers)
    if (!/^[a-zA-Z0-9]*$/.test(val)) return;

    const newOtp = [...otp];
    // Force uppercase for better UX
    newOtp[index] = val.toUpperCase(); 
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 7) { 
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setPreviewData(null);
      setError("");
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    // CHANGED: Slice to 8 characters
    const val = e.clipboardData.getData("text").slice(0, 8);
    
    // Check if alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(val)) return;

    const newOtp = val.toUpperCase().split("");
    while (newOtp.length < 8) newOtp.push(""); // Fill rest
    setOtp(newOtp);

    // Focus appropriate box
    const lastFilled = val.length < 8 ? val.length : 7;
    inputRefs.current[lastFilled].focus();
  };

  // --- API ACTIONS ---
  const handleVerify = async () => {
    const code = otp.join("");
    // CHANGED: Check for length 8
    if (code.length < 8) return;

    setLoading(true);
    setError("");
    setPreviewData(null);

    try {
      const data = await verifyRoomCode(code);
      setPreviewData(data); 
    } catch (err) {
      setError(err.message || "Invalid Room Code");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAction = async () => {
    if (!previewData) return;

    if (previewData.isMember || previewData.isAdmin) {
      navigate(`/rooms/${previewData.roomId}`);
      onClose();
      return;
    }

    setLoading(true);
    try {
      await requestToJoinRoom(previewData.roomId);
      setSuccessMsg("Request sent successfully!");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger verify when 8 digits are filled
  useEffect(() => {
    if (otp.every((char) => char !== "")) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
            <h2>Join via Code</h2>
            <p className="subtitle">Enter the 8-character room code.</p>
        </div>

        {/* OTP INPUTS */}
        <div className="otp-container">
          {otp.map((data, index) => (
            <input
              className={`otp-input ${error ? "input-error" : ""}`}
              type="text"
              inputMode="text" 
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="status-container">
            {loading && !previewData && <p className="status-msg loading">Verifying Code...</p>}
            {error && <p className="status-msg error">{error}</p>}
            {successMsg && <p className="status-msg success-msg">{successMsg}</p>}
        </div>

        {previewData && !successMsg && (
          <div className="room-preview fade-in">
            <div className="preview-header">
              <h3>{previewData.post?.title}</h3>
              {previewData.isMember ? (
                  <span className="badge badge-joined">Member</span>
              ) : previewData.canApply ? (
                  <span className="badge badge-open">Open</span>
              ) : (
                  <span className="badge badge-closed">Closed</span>
              )}
            </div>

            <p className="preview-desc">{previewData.post?.description}</p>
            
            <button 
              className={`btn-primary full-width ${!previewData.canApply && !previewData.isMember && !previewData.isAdmin ? 'btn-disabled' : ''}`}
              onClick={handleJoinAction}
              disabled={loading || (!previewData.canApply && !previewData.isMember && !previewData.isAdmin)}
            >
              {loading ? "Processing..." : 
                previewData.isMember || previewData.isAdmin ? "Go to Room" :
                !previewData.canApply ? "Cannot Join" : 
                "Request to Join"
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinByCode;