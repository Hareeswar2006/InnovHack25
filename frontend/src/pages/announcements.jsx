import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostCard from "../components/postcard.jsx";
import ResumeBanner from "../components/resumebanner.jsx";
import { fetchAnnouncements } from "../api/posts.js";
import "./announcements.css";

function Announcements() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                const res = await fetchAnnouncements();
                setPosts(res.announcements || []);
            }
            catch (error) {
                console.log(`Failed to load announcements - ${error.message}`)
            }
            finally {
                setLoading(false);
            }
        };
        
        loadAnnouncements();
    }, []);

    useEffect(() => {
        if (!loading && location.hash) {
            const elementId = location.hash.replace("#", "");
            const element = document.getElementById(elementId);

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.style.border = "2px solid #2563eb";
                    setTimeout(() => { element.style.border = "1px solid #e5e7eb" }, 2000);
                }, 100);
            }
        }
    }, [loading, location.hash]);

    return (
        <>
            <div className="page-container">
                <ResumeBanner />

                {loading && <p>Loading announcements...</p>}

                {!loading && posts.length === 0 && (
                <p>No announcements found.</p>
                )}

                {posts.map((post) => (
                <PostCard key={post._id} post={post} />
                ))}
            </div>

            <button className="fab" onClick={() => navigate("/posts/create")} >+</button>
        </>
    );
}

export default Announcements;