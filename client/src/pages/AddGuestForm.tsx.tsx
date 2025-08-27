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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await pb.collection("guests").create(form);
    navigate("/guests");
  };

  const fields: (keyof typeof form)[] = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "address",
    "date_of_birth",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Add New Guest
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block mb-1 text-gray-700 dark:text-gray-200 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type={field === "date_of_birth" ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={["first_name", "last_name", "email"].includes(field)}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGuestForm;
