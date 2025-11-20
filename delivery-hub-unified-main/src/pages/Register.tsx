import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    aadhar: "",
    address: "",
    photo: null,
    phone: "",
    otp: "",
    generatedOtp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOtpSend = () => {
    // Simulate OTP generation and sending
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, generatedOtp });
    setOtpSent(true);
    alert(`OTP sent to ${formData.phone}: ${generatedOtp}`); // Replace with actual OTP sending logic
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.otp !== formData.generatedOtp) {
  //     alert("Invalid OTP. Please try again.");
  //     return;
  //   }

  //   // Prepare form data for submission
  //   const userData = { ...formData };
  //   delete userData.generatedOtp; // Remove OTP from the data

  //   try {
  //     // Send data to the backend
  //     const response = await fetch("https://unified-delivery-manager.onrender.com/api/auth/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("Registration successful!");
  //       navigate("/login"); // Redirect to the login page
  //     } else {
  //       alert(data.message || "Registration failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during registration:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.otp !== formData.generatedOtp) {
    alert("Invalid OTP. Please try again.");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("password", formData.password);
  data.append("aadhar", formData.aadhar);
  data.append("address", formData.address);
  data.append("photo", formData.photo); // append the File object
  data.append("phone", formData.phone);

  try {
    const response = await fetch("https://unified-delivery-manager.onrender.com/api/auth/register", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert(result.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
};


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Aadhar Card Number</label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
          {!otpSent && (
            <button
              type="button"
              onClick={handleOtpSend}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send OTP
            </button>
          )}
        </div>
        {otpSent && (
          <div>
            <label className="block text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
