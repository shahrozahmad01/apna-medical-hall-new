function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-copy">© {new Date().getFullYear()} Apna Medical Hall — Licensed Pharmacy. Your Health, Our Priority.</p>
          <p className="footer-copy">Follow us on <a href="#">Facebook</a>, <a href="#">Instagram</a>, <a href="#">LinkedIn</a>.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
