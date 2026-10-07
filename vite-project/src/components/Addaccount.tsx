import { useState } from "react";
import axios from "axios";

interface AccountDTO {
  userId: number;
  balance: number;
}




const AddAccount = () => {
  const [formData, setFormData] = useState<AccountDTO>({
    userId: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8087/account",
        formData,
    
      );


      console.log(response.data);
      setMessage(response.data.message);
     

        setFormData({
          userId: 0,
          balance: 0,
        });
      }
    catch (error) {
      console.error(error);
      setMessage("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">

      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Add Account
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
           Enter User ID
          </label>

          <input
            type="number"
            name="userId"
            value={formData.userId || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter User ID"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Enter Initial Balance
          </label>

          <input
            type="number"
            name="balance"
            value={formData.balance || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Balance"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 font-medium">
          {message}
        </p>
      )}

    </section>
  );
};

export default AddAccount;