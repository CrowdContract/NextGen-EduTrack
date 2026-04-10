import { useState } from "react"; // ✅ FIX ADDED
import { useParams } from "react-router-dom";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../store/slices/authSlice";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
        })
      ).unwrap();

      navigate("/login");
    } catch (err) {
      setError(err || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">

        <h2 className="text-xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Reset Password
          </button>

          <div className="text-center mt-2">
            <Link to="/login" className="text-blue-500 text-sm">
              Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;