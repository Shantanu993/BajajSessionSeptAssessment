"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:3005")
      .then((res) => res.json())
      .then((data) => setUsers(data.reverse())) // Reverse the user array to show the newest first
      .catch((err) => console.log(`Error in API call: ${err}`));
  };

  const handleAddUser = () => {
    fetch("http://localhost:3005/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        return res.text().then((text) => Promise.reject(text));
      })
      .then((message) => {
        console.log(message);
        setNewUser({ name: "", email: "", password: "" });
        setError("");
        fetchUsers(); // Fetch updated users list after successful addition
      })
      .catch((err) => setError(err));
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      {/* Form to add new user */}
      <div className="mt-4 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-black font-bold mb-4">Add User</h3>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-200"
          >
            Add User
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center mb-8">
        {Array.from(
          { length: Math.ceil(users.length / usersPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {/* Display users */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentUsers.map((user, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-500">
              {user.name}
            </h2>
            <p className="text-gray-700">{user.email}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
