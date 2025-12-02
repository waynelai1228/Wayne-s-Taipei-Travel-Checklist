import Logo from "./Logo";
import logoImg from "../assets/Taiwan_Thailand_logo.svg";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <Logo src={logoImg} alt="Travel Checklist Logo" />
      </div>
      <h1 className="header-title">Wayne's Taipei Travel Checklist</h1>
    </header>
  );
}
