import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import UploadPrescription from "./pages/UploadPrescription";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCart = () => setCartCount(Number(localStorage.getItem("amph-cart-count") || 0));
    refreshCart();
    window.addEventListener("amph-cart-updated", refreshCart);
    return () => window.removeEventListener("amph-cart-updated", refreshCart);
  }, []);

  return (
    <div className="app-shell">
      <Navbar cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/upload-prescription" element={<UploadPrescription />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
