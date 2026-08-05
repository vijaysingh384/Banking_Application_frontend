import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Add User", href: "/add-user" },
    { label: "Add Account", href: "/add-account" },
    { label: "Deposit", href: "/deposit" },
    { label: "Withdraw", href: "/withdraw" },
    { label: "Loan", href: "/loan" },
    { label: "Users", href: "/users" },
    { label: "Accounts", href: "/accounts" },
    { label: "Loans", href: "/loans" },
    { label: "Transfer Funds", href: "/transferfund" }
  ];

  return (
    <PillNav
      logo="/bank-logo.svg"
      logoAlt="Banking System Logo"
      items={navItems}
      activeHref={location.pathname}
      baseColor="#ffffff"
      pillColor="#07080bff"
      hoveredPillTextColor="#0a0a0bff"
      pillTextColor="#d7dae2ff"
      initialLoadAnimation={true}
    />
  );
};

export default NavigationBar;