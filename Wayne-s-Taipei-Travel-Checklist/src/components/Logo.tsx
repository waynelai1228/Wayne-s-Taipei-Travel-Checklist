import "./Logo.css";

interface LogoProps {
  src: string;
  alt?: string;
}

export default function Logo({ src, alt = "Logo" }: LogoProps) {
  return (
    <div className="logo-container">
      <img src={src} alt={alt} className="logo-img" />
    </div>
  );
}
