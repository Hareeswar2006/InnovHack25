import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Announcements from "./pages/announcements";
import Room from "./pages/room";
import Profile from "./pages/profile";
import Createpost from "./pages/createpost";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/announcements" element={ <ProtectedRoute> <Announcements /> </ProtectedRoute> } />
        <Route path="/posts/create" element={<ProtectedRoute> <Createpost /> </ProtectedRoute> } />
        <Route path="/rooms/:roomId" element={<ProtectedRoute> <Room /> </ProtectedRoute> } />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute> } />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/announcements" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;