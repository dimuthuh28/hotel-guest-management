import React, { useEffect, useState } from "react";
import pb from "../lib/pb";
import { useParams, useNavigate } from "react-router-dom";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

const GuestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const fetchGuest = async () => {
      if (id) {
        const record = await pb.collection("guests").getOne(id);

        let formattedDate = "";
        if (record.date_of_birth) {
          const date = new Date(record.date_of_birth);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }

        const guestData: Guest = {
          id: record.id,
          first_name: record.first_name,
          last_name: record.last_name,
          email: record.email,
          phone: record.phone,
          address: record.address,
          date_of_birth: formattedDate,
        };

        setGuest(guestData);
      }
    };
    fetchGuest();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!guest) return;
    const { name, value } = e.target;
    setGuest({
      ...guest,
      [name]: value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && guest) {
      await pb.collection("guests").update(id, guest);
      navigate("/guests");
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm("Are you sure you want to delete this guest?")) {
      await pb.collection("guests").delete(id);
      navigate("/guests");
    }
  };

  if (!guest) return <p className="p-6">Loading...</p>;

  const fields: Array<{
    key: keyof Guest;
    label: string;
    type: string;
    required: boolean;
  }> = [
    { key: "first_name", label: "First Name", type: "text", required: true },
    { key: "last_name", label: "Last Name", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone", type: "tel", required: false },
    { key: "address", label: "Address", type: "text", required: false },
    { key: "date_of_birth", label: "Date Of Birth", type: "date", required: false },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Edit Guest
        </h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block mb-1 text-gray-700 dark:text-gray-200">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.key}
                value={guest[field.key] || ""}
                onChange={handleChange}
                required={field.required}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          ))}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestDetail;