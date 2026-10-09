import { useState } from "react";
import axios from "axios";

interface WithdrawRequest {
  accountId: number;
  amount: number;
}

const Withdraw = () => {
  const [formData, setFormData] = useState<WithdrawRequest>({
    accountId: 0,
    amount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);



  const API_BASE_URL = "https://banking-backend-re7q.onrender.com";

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
      const response = await axios.post(`${API_BASE_URL}/withdrawMoney`,
        null,
        {
          params: {
          accountId: formData.accountId,
          amount: formData.amount,
        },
          
        }
        
      );

      console.log(response.data);
      setMessage(response.data.message);

        setFormData({
          accountId: 0,
          amount: 0,
        });
      }
     catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white shadow-xl rounded-xl p-6">

      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Withdraw Money
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Account ID
          </label>

          <input
            type="number"
            name="accountId"
            value={formData.accountId || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Enter Account ID"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Withdrawal Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Enter Amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

      </form>

    </section>
  );
};

export default Withdraw;