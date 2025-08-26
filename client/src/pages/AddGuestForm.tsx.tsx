import React, { useState } from "react";
import pb from "../lib/pb";
import { useNavigate } from "react-router-dom";

const AddGuestForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await pb.collection("guests").create(form);
    navigate("/guests");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Guest</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-1/2">
        {["first_name", "last_name", "email", "phone", "address", "date_of_birth"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field.replace("_", " ")}</label>
            <input
              type={field === "date_of_birth" ? "date" : "text"}
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required={["first_name", "last_name", "email"].includes(field)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        ))}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddGuestForm;
