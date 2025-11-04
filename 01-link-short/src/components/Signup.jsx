import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import UseFetch from "../hooks/UseFetch";
import { signup } from "../db/Auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { urlState } from "../Context";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null
    });
    const [profilePic, setProfilePic] = useState(null);
    const [showPass, setShowPass] = useState(false);

    const { data, error, loading, fetchData } = UseFetch(signup);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const longlink = searchParams.get("createNew");
    const { fetchuser } = urlState();

    // 🧭 Redirect and fetch user after successful signup
    useEffect(() => {
        if (error === null && data) {
            navigate(`/dashboard?${longlink ? `createNew=${longlink}` : ""}`);
            console.log("✅ Signup successful:", data);
            fetchuser();
        }
    }, [data, error]);

    // 📸 Handle profile picture upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };

    // ✍️ Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 🚀 Handle Signup
    const handleSignup = async () => {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string()
                    .email("Invalid email format")
                    .required("Email is required"),
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                profilePic: Yup.mixed().required("Profile picture is required"),
            });

            await schema.validate(
                { ...formData, profilePic },
                { abortEarly: false }
            );

            await fetchData({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                profile_pic: profilePic,
            });
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((e) => console.warn("⚠️", e.message));
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md mx-auto">
            {/* Profile Picture Upload */}
            <div className="flex justify-center mt-6">
                <div className="relative">
                    <label htmlFor="profile-upload" className="cursor-pointer group">
                        <img
                            src={
                                profilePic
                                    ? URL.createObjectURL(profilePic)
                                    : "https://www.w3schools.com/howto/img_avatar.png"
                            }
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-80 transition-opacity"
                        />
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Header */}
            <div className="p-4 border-b border-gray-200 text-center">
                <h2 className="text-lg font-bold">Signup</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Create your account by filling in the information below.
                </p>
            </div>

            {/* Form Fields */}
            <div className="p-4 flex flex-col gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-name" className="text-gray-700 font-medium">
                        Name
                    </label>
                    <input
                        id="signup-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-email" className="text-gray-700 font-medium">
                        Email
                    </label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 relative">
                    <label htmlFor="signup-password" className="text-gray-700 font-medium">
                        Password
                    </label>
                    <input
                        id="signup-password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 text-right">
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </div>
        </div>
    );
}
