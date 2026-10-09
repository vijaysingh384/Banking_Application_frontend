import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

interface ResponseDTO {
  Statuscode: number;
  dtos: User[];
  error: boolean;
  message: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const API_BASE_URL = "https://banking-backend-re7q.onrender.com";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);

      console.log("Response:", response.data);

      setUsers(response.data.dtos);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg">

      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-700">
          Users List
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">User Name</th>
            </tr>

          </thead>

          <tbody>

            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="py-6 text-center text-gray-500"
                >
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">
                    {user.id}
                  </td>

                  <td className="px-6 py-4">
                    {user.name}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
};

export default UsersList;