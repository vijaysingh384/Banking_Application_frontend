import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import LandingPage from "./pages/LandingPage";
import AddUser from "./features/users/Adduser";
import AddAccount from "./features/account/Addaccount";
import Deposit from "./features/account/Deposit";
import Withdraw from "./features/account/Withdraw";
import GetLoan from "./features/loans/GetLoan";
import UsersList from "./features/users/Userslist";
import AccountsList from "./features/account/AccountList";
import LoansList from "./features/loans/Loanslist";
import TransferFund from "./features/account/TransferFund";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
{/*       */}
        
        <Route path="/users" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <UsersList />
            </div>
          </div>
        } />
        
        <Route path="/accounts" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AccountsList />
            </div>
          </div>
        } />
        
        <Route path="/loans" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <LoansList />
            </div>
          </div>
        } />
        
        <Route path="/add-user" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AddUser />
            </div>
          </div>
        } />
        
        <Route path="/add-account" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AddAccount />
            </div>
          </div>
        } />
        
        <Route path="/deposit" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Deposit />
            </div>
          </div>
        } />
        
        <Route path="/withdraw" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Withdraw />
            </div>
          </div>
        } />
        
        <Route path="/loan" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <GetLoan />
            </div>
          </div>
        } />

        <Route path="/transferfund" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <TransferFund />
            </div>
          </div>
        } />

        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="text-center mt-20">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-gray-500 mt-2">Page Not Found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;