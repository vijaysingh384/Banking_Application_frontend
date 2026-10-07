import { useState } from "react";
import axios from "axios";

interface TransferFundProps {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

const TransferFund = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<TransferFundProps>({
    fromAccountId: 0,
    toAccountId: 0,
    amount: 0,
  });

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
      console.log(formData);

      const response = await axios.post(
        "http://localhost:8087/transferAmount",
        null,
        {
          params: {
            fromAccountId: formData.fromAccountId,
            toAccountId: formData.toAccountId,
            amount: formData.amount,
          },
        }
      );

      console.log(response.data);

      setMessage(response.data.message);

      setFormData({
        fromAccountId: 0,
        toAccountId: 0,
        amount: 0,
      });
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Transfer failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Transfer Money
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            From Account ID
          </label>

          <input
            type="number"
            name="fromAccountId"
            value={formData.fromAccountId || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            To Account ID
          </label>

          <input
            type="number"
            name="toAccountId"
            value={formData.toAccountId || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          {loading ? "Transferring..." : "Transfer"}
        </button>

        {message && (
          <p className="text-center mt-4 font-medium text-blue-600">
            {message}
          </p>
        )}

      </form>
    </section>
  );
};

export default TransferFund;