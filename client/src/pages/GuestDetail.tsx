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
        setGuest(record as Guest);
      }
    };
    fetchGuest();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!guest) return;
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && guest) {
      await pb.collection("guests").update(id, guest);
      navigate("/guests");
    }
  };

  const handleDelete = async () => {
    if (id) {
      await pb.collection("guests").delete(id);
      navigate("/guests");
    }
  };

  if (!guest) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Guest</h1>
      <form onSubmit={handleUpdate} className="space-y-4 w-1/2">
        {["first_name", "last_name", "email", "phone", "address", "date_of_birth"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field.replace("_", " ")}</label>
            <input
              type={field === "date_of_birth" ? "date" : "text"}
              name={field}
              value={(guest as any)[field] || ""}
              onChange={handleChange}
              required={["first_name", "last_name", "email"].includes(field)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        ))}
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestDetail;
