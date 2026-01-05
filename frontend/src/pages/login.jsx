import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      if (onLogin) onLogin();
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6A1B9A] via-[#7B1FA2] to-[#9C27B0]">
      <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="relative w-[55%] bg-gradient-to-br from-[#63238F] via-[#6E2A99] to-[#8A3EB3]">
          <div className="absolute inset-0">
            <div className="absolute left-0 top-0 w-full h-full opacity-30">
              <div className="absolute left-10 top-10 w-6 h-6 bg-white rounded-full" />
              <div className="absolute left-24 top-32 w-4 h-4 bg-white rounded-full" />
              <div className="absolute left-56 top-20 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="absolute left-10 right-10 top-16 text-white">
            <div className="text-3xl font-semibold">Note Taking System</div>
            <div className="text-sm mt-2 opacity-80">Welcome to Note taking  website.</div>
          </div>
          <div className="absolute left-10 bottom-0 w-[85%] h-[60%]">
            <div className="absolute left-0 bottom-0 w-full h-full">
              <div className="absolute left-0 bottom-0 w-full h-24 bg-white/60 rounded-t-[120px]" />
              <div className="absolute left-24 bottom-24 w-24 h-24 bg-white/70 rounded-full" />
              <div className="absolute left-56 bottom-12 w-12 h-12 bg-white/60 rounded-full" />
              <div className="absolute left-80 bottom-20 w-16 h-16 bg-white/60 rounded-full" />
            </div>
            <div className="absolute left-6 bottom-40 w-28 h-14 bg-white rounded-[28px] rotate-12">
              <div className="absolute left-4 top-3 w-4 h-4 bg-[#FF2D7A] rounded-full" />
              <div className="absolute right-2 top-5 w-16 h-3 bg-[#D6C3E9] rounded-full" />
            </div>
          </div>
        </div>
        <div className="w-[45%] bg-white flex items-center justify-center">
          <div className="w-[78%]">
            <div className="text-[#8A8FA0] text-sm mb-3">USER LOGIN</div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  className="w-full h-10 rounded-full bg-[#E7DAF5] px-10 text-[#5E5E6F] placeholder-[#7C7D90] focus:outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C7D90]">👤</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-10 rounded-full bg-[#E7DAF5] px-10 text-[#5E5E6F] placeholder-[#7C7D90] focus:outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C7D90]">🔒</span>
              </div>
              <button
                type="submit"
                className="w-full h-9 rounded-full bg-[#6D2AA0] text-white"
              >
                Login
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-[#6D2AA0]">
              <Link to="/signup" className="hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
