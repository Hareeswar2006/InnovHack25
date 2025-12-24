import "./resumebanner.css";

function ResumeBanner() {
    return (
        <div className="resume-banner">
            <div>
                <strong>Upload your resume</strong> to get AI-powered recommendations and access to request to rooms.
            </div>
            <button className="btn btn-primary">Upload Resume</button>
        </div>
    );
}

export default ResumeBanner;