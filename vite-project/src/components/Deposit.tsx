import { useState } from "react";
import axios from "axios";

interface DepositRequest {
  accountId: number;
  amount: number;
}

const Deposit = () => {
  const [formData, setFormData] = useState<DepositRequest>({
    accountId: 0,
    amount: 0,
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
        "http://localhost:8087/depositMoney",
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
    } catch (error) {
      console.error(error);
      setMessage("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Deposit Money
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

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
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Account ID"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Deposit Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Depositing..." : "Deposit"}
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

export default Deposit;