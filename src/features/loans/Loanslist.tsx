import { useEffect, useState } from "react";
import axios from "axios";

interface Loan {
  id: number;
  userId: number;
  sanctionAmount: number;
}

interface ResponseDTO {
  Statuscode: number;
  loandtos: Loan[];
  error: boolean;
  message: string;
}

const LoansList = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "https://banking-backend-re7q.onrender.com";

  useEffect(() => {
    fetchLoans();
  }, []);
  
  const fetchLoans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/loans`);
        

        console.log(response.data);
        setLoans(response.data.loandtos);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch loans.");
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading loans...
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
    <section className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl mt-10">

      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-700">
          Loans List
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Loan ID</th>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Loan Amount</th>
            </tr>
          </thead>

          <tbody>

            {loans.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-500"
                >
                  No Loans Available
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-4">
                    {loan.id}
                  </td>

                  <td className="px-6 py-4">
                    {loan.userId}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹ {loan.sanctionAmount != null ? loan.sanctionAmount.toLocaleString() : '0'}
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

export default LoansList;