import { useState } from "react";
import Seo from "../components/Seo";

function UploadPrescription() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus("Please select a prescription file before upload.");
      return;
    }
    setLoading(true);
    setStatus("");

    try {
      const form = new FormData();
      form.append("prescription", file);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/prescriptions/upload`, {
        method: "POST",
        credentials: "include",
        body: form
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed.");
      setStatus("Prescription uploaded successfully. Our pharmacy team will review it shortly.");
      setFile(null);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Upload Prescription | Apna Medical Hall" description="Upload your prescription quickly for medicine fulfillment." path="/upload-prescription" />
      <section className="container section upload-page">
        <div className="upload-panel">
          <div>
            <span className="eyebrow">Prescription upload</span>
            <h1>Upload your doctor’s prescription</h1>
            <p className="section-copy">Choose a file and send it securely to our pharmacy team for verification and order preparation.</p>
          </div>
          <form className="upload-form" onSubmit={handleSubmit}>
            <label className="upload-card" htmlFor="prescription-upload">
              <span className="upload-icon">📄</span>
              <strong>{file ? file.name : "Select prescription file"}</strong>
              <span className="muted">PDF, JPG, or PNG · max 10MB</span>
            </label>
            <input
              id="prescription-upload"
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? "Uploading…" : "Upload prescription"}
            </button>
            {status ? <p className="status-message">{status}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}

export default UploadPrescription;
