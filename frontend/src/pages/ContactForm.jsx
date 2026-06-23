import { useState } from "react";
import API from "../services/api";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitLead = async (e) => {
    e.preventDefault();

    try {
      await API.post("/leads", formData);
      alert("Lead submitted successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "Website",
      });
    } catch (error) {
      alert("Failed to submit lead");
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2>Contact Us</h2>
        <p>Submit your details and our team will contact you.</p>

        <form onSubmit={submitLead}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="Website">Website</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <button type="submit">Submit Lead</button>
        </form>

        <a href="/login">Admin Login</a>
      </div>
    </div>
  );
}

export default ContactForm;