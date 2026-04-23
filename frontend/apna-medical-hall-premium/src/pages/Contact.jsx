import Seo from "../components/Seo";

function Contact() {
  return (
    <>
      <Seo title="Contact | Apna Medical Hall" description="Reach our licensed pharmacy team for support and questions." path="/contact" />
      <section className="container section contact-page">
        <div className="contact-grid">
          <div className="contact-panel">
            <span className="eyebrow">Contact us</span>
            <h1>Need help? We’re here for you.</h1>
            <p className="section-copy">Talk to our pharmacy experts for order tracking, prescription support, or general wellness guidance.</p>
            <div className="contact-card">
              <h2>Phone</h2>
              <p><a href="tel:+911234567890">+91 12345 67890</a></p>
            </div>
            <div className="contact-card">
              <h2>Email</h2>
              <p><a href="mailto:support@apnamedicalhall.in">support@apnamedicalhall.in</a></p>
            </div>
            <div className="contact-card">
              <h2>Address</h2>
              <p>123 Health Street, Sector 9, New Delhi, India</p>
            </div>
            <a className="button button-primary" href="https://wa.me/918084469086?text=Hello%2C%20I%20need%20pharmacy%20support" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
          <div className="map-panel">
            <iframe
              title="Apna Medical Hall location"
              src="https://maps.google.com/maps?q=New%20Delhi%20India&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
