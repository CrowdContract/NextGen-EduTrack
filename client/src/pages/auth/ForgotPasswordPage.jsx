import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  // ✅ get loading state from redux
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      setError(err || "Failed to send reset link");
    }
  };

  // ================= SUCCESS UI =================
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">

          <h2 className="text-xl font-semibold mb-4">
            Check your email 📩
          </h2>

          <p className="text-gray-600">
            If an account with <strong>{email}</strong> exists,
            you will receive a reset link shortly.
          </p>

          <Link
            to="/login"
            className="block mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ================= FORM UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-500 p-3 rounded-full">
              <BookOpen className="text-white w-6 h-6" />
            </div>
          </div>

          <h2 className="text-xl font-semibold">
            Educational Project Management
          </h2>

          <p className="text-gray-500 text-sm">
            Reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isRequestingForToken}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {isRequestingForToken
              ? "Sending..."
              : "Send Reset Link"}
          </button>

          {/* Back */}
          <div className="text-right">
            <Link
              to="/login"
              className="text-sm text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;