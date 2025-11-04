import { useEffect, useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import UseFetch from "../hooks/UseFetch";
import * as Yup from "yup";
import { login } from "../db/Auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlContext } from "../Context";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);

    const { data, error, loading, fetchData } = UseFetch(login);
    const [searchParams] = useSearchParams();
    const longlink = searchParams.get("createNew");
    const { fetchuser } = useContext(UrlContext); // ✅ Correct hook usage

    const navigate = useNavigate();

    useEffect(() => {
        if (!error && data) {
            navigate(`/dashboard?${longlink ? `createNew=${longlink}` : ""}`);
            console.log("✅ Login successful:", data);
            fetchuser();
        }
    }, [data, error, longlink, navigate, fetchuser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handellogin = async () => {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid email").required(),
                password: Yup.string().min(6).required(),
            });
            await schema.validate(formData, { abortEarly: false });
            await fetchData(formData.email, formData.password);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">Login</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Enter your email and password to login.
                </p>
            </div>

            <div className="p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="login-email" className="text-gray-700 font-medium">
                        Email
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-2 relative">
                    <label htmlFor="login-password" className="text-gray-700 font-medium">
                        Password
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={formData.password}
                        className="border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-2 top-[38px] text-gray-500"
                    >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 text-right">
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    onClick={handellogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}
