import { NavLink } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <header className="site-header">
      <div className="container navbar">
        <NavLink className="brand" to="/">
          Apna Medical Hall
        </NavLink>
        <nav className="nav-links">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/products">Products</NavLink>
          <NavLink className="nav-link" to="/upload-prescription">Prescription</NavLink>
          <NavLink className="nav-link" to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          <NavLink className="button button-secondary" to="/cart">
            Cart {cartCount ? `(${cartCount})` : ""}
          </NavLink>
          <NavLink className="button button-primary" to="/checkout">
            Checkout
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
