import React, { useEffect, useState } from "react";
import pb from "../lib/pb";
import { Link } from "react-router-dom";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");

  const fetchGuests = async (query: string = "") => {
    const records = await pb.collection("guests").getList(1, 20, {
      filter: query
        ? `first_name ~ "${query}" || last_name ~ "${query}"`
        : "",
    });
    setGuests(records.items);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchGuests(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Guest List</h1>
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search guests..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-1/3"
        />
        <Link
          to="/guests/new"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Guest
        </Link>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td className="border px-4 py-2">
                {guest.first_name} {guest.last_name}
              </td>
              <td className="border px-4 py-2">{guest.email}</td>
              <td className="border px-4 py-2">{guest.phone}</td>
              <td className="border px-4 py-2">
                <Link
                  to={`/guests/${guest.id}`}
                  className="text-blue-600 underline"
                >
                  View / Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestList;
