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

  useEffect(() => {
    const controller = new AbortController();

  const fetchGuests = async (query: string = "") => {
    try {
      const records = await pb.collection("guests").getList(1, 20, {
        filter: query ? `first_name ~ "${query}" || last_name ~ "${query}"` : "",
      });

      const guests: Guest[] = records.items.map((r) => ({
        id: r.id,
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        phone: r.phone,
        address: r.address,
        date_of_birth: r.date_of_birth,
      }));

      setGuests(guests);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if ((err as { name?: string }).name === "AbortError") return; 
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };


    fetchGuests(search);

    return () => controller.abort(); 
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); 
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Guest List
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Link
            to="/guests/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          >
            + Add Guest
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr
                  key={guest.id}
                  className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                >
                  <td className="px-4 py-3 border font-medium text-gray-800 dark:text-gray-100">
                    {guest.first_name} {guest.last_name}
                  </td>
                  <td className="px-4 py-3 border">{guest.email}</td>
                  <td className="px-4 py-3 border">{guest.phone || "-"}</td>
                  <td className="px-4 py-3 border text-center">
                    <Link
                      to={`/guests/${guest.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View / Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No guests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestList;