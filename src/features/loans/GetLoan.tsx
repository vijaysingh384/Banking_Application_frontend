import { useState } from "react";
import axios from "axios";

interface LoanRequest {
  accountId: number;
  sanctionAmount: number;
}

const GetLoan = () => {
  const [formData, setFormData] = useState<LoanRequest>({
    accountId: 0,
    sanctionAmount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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
        "http://localhost:8087/loan",
        formData,
        {
        params: {
          accountId: formData.accountId,
          amount: formData.sanctionAmount,
        },
      }
      );

      console.log(response.data);
      setMessage(response.data.message);
        setFormData({
          accountId: 0,
          sanctionAmount: 0,
        });
      
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Unable to process loan request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto bg-white shadow-xl rounded-xl p-6 mt-10">

      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Loan Application
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            User ID
          </label>

          <input
            type="number"
            name="userId"
            value={formData.accountId || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter User ID"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Loan Amount
          </label>

          <input
            type="number"
            name="sanctionAmount"
            value={formData.sanctionAmount || ""}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Loan Amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Apply for Loan"}
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

export default GetLoan;