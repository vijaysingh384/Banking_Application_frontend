import { useEffect, useState } from "react";
import axios from "axios";

interface Account {
  id: number;
  userId: number;
  balance: number;
}

interface ResponseDTO {
  Statuscode: number;
  accountdtos: Account[];
  error: boolean;
  message: string;
}

const AccountsList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "https://banking-backend-re7q.onrender.com";

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      

      console.log(response.data);

      setAccounts(response.data.accountdtos);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg border">

      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-700">
          Accounts List
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3">Account ID</th>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3">Balance</th>
            </tr>
          </thead>

          <tbody>

            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-500"
                >
                  No Accounts Available
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-3">{account.id}</td>
                  <td className="px-6 py-3">{account.userId}</td>
                  <td className="px-6 py-3 font-semibold text-green-600">
                    ₹ {account.balance.toLocaleString()}
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

export default AccountsList;