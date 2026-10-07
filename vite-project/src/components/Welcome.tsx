import { Landmark, CreditCard, Wallet, BadgeDollarSign } from "lucide-react";


const Welcome = () => {
  return (
    <section className="max-w-6xl mx-auto mt-10">

      <div className=" bg-zinc-100 rounded-2xl shadow-xl text-white p-10">

        <div className="flex items-center gap-4">

          <Landmark size={50} />

          <div>
            <h1 className="text-4xl font-bold">
              Welcome to Banking Management System
            </h1>

            <p className="mt-3 text-lg text-gray-200">
              Secure banking application built with Spring Boot, React,
              TypeScript and MySQL.
            </p>

          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <img src="/images/account.jpg" alt="" className="w-full h-32 object-cover rounded-lg" />

        <div className="bg-white rounded-xl shadow-lg p-6">
          

          <CreditCard className="text-blue-600 mb-4" size={40} />

          <h2 className="text-xl font-semibold">
            Account Management
          </h2>

          <p className="text-gray-600 mt-2">
            Create and manage customer bank accounts with ease.
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <Wallet className="text-green-600 mb-4" size={40} />

          <h2 className="text-xl font-semibold">
            Deposit & Withdraw
          </h2>

          <p className="text-gray-600 mt-2">
            Perform secure deposits and withdrawals instantly.
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <BadgeDollarSign
            className="text-indigo-600 mb-4"
            size={40}
          />

          <h2 className="text-xl font-semibold">
            Loan Services
          </h2>

          <p className="text-gray-600 mt-2">
            Apply for loans and manage approvals efficiently.
          </p>

        </div>

      </div>

    </section>
  );
};

export default Welcome;