import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Agar allaqachon kirilgan bo'lsa, dashboardga yo'naltirish
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (admin?.isAdmin || currentUser?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1-usul: Hardcoded admin (tezkor test uchun)
    if (email === "admin@admin.com" && password === "admin123") {
      
      const adminUser = {
        id: 1,
        username: "Super Admin",
        email: "admin@admin.com",
        isAdmin: true,
        role: "super_admin",
        loginTime: new Date().toISOString()
      };

      // Admin ma'lumotlarini saqlash
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      localStorage.setItem("admin", JSON.stringify(adminUser));
      
      // Session ma'lumotlari
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminLoginTime", new Date().toISOString());

      setLoading(false);
      navigate("/admin/dashboard");
      return;
    }

    // 2-usul: users array dan tekshirish
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      
      // Userni qidirish
      const foundUser = users.find(
        u => u.email === email && u.password === password && u.isAdmin === true
      );

      if (foundUser) {
        // Parolni olib tashlash xavfsizlik uchun
        const { password: _, ...userWithoutPassword } = foundUser;
        
        const adminUser = {
          ...userWithoutPassword,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        localStorage.setItem("admin", JSON.stringify(adminUser));
        
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminLoginTime", new Date().toISOString());

        setLoading(false);
        navigate("/admin/dashboard");
      } else {
        setError("Email yoki parol noto'g'ri yoki siz admin emassiz");
        setLoading(false);
      }
    } catch (err) {
      setError("Tizimda xatolik yuz berdi");
      setLoading(false);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="logo-container">
            <span className="logo-icon">⚙️</span>
          </div>
          <h2>Admin Panel</h2>
          <p>Kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-icon">📧</span>
              Email manzil
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Parol
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Eslab qol
            </label>
         <button className="forgot-password">Parolni unutdingizmi?</button>
          </div>

          <button 
            type="submit" 
            className={`admin-login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Tekshirilmoqda...
              </>
            ) : (
              <>
                <span>Kirish</span>
                <span className="btn-icon">→</span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="demo-credentials">
            <p className="demo-title">📋 Test ma'lumotlari:</p>
            <div className="credentials-box">
              <div className="credential-item">
                <span className="cred-label">Email:</span>
                <code>admin@admin.com</code>
                <button 
                  className="copy-btn" 
                  onClick={() => {
                    navigator.clipboard.writeText("admin@admin.com");
                    alert("Email nusxalandi!");
                  }}
                >
                  📋
                </button>
              </div>
              <div className="credential-item">
                <span className="cred-label">Parol:</span>
                <code>admin123</code>
                <button 
                  className="copy-btn" 
                  onClick={() => {
                    navigator.clipboard.writeText("admin123");
                    alert("Parol nusxalandi!");
                  }}
                >
                  📋
                </button>
              </div>
            </div>
          </div>
          
          <div className="security-note">
            <span className="note-icon">🔐</span>
            <span>Xavfsizlik uchun brauzerni yopgandan so'ng avtomatik chiqib ketadi</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="admin-login-bg">
        <div className="bg-circle circle1"></div>
        <div className="bg-circle circle2"></div>
        <div className="bg-circle circle3"></div>
      </div>
    </div>
  );
};

export default AdminLogin;