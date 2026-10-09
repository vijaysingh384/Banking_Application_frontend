import { useState } from "react";
import axios from "axios";

interface UserRequest {
  name: string;
}

const AddUser = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const API_BASE_URL = "https://banking-backend-re7q.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const user : UserRequest = {
          name,
      };

      const response = await axios.post(`${API_BASE_URL}/adduser`,
        user,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      setMessage(response.data.message );
      setName("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Add User
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
  

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Enter User Name
          </label>

          <input
            type="text"
            placeholder="Enter User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add User"}
        </button>

        {message && (
          <p className="text-center font-medium text-green-600">
            {message}
          </p>
        )}
      </form>

    </section>
  );
};

export default AddUser;