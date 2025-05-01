import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  link?: string;
  target?: string;
  children: ReactNode;
  className?: string;
}

const CtaButton = ({
  type,
  link,
  target,
  children,
  className = "",
}: ButtonProps) => {
  const buttonClasses: string = `bg-brand-blue text-white py-2 px-4 rounded-br-xl uppercase w-full flex justify-center hover:bg-brand-teal transition-colors duration-200 pointer ${className}`;

  if (type) {
    return (
      <button type={type} className={buttonClasses}>
        {children}
      </button>
    );
  } else if (link) {
    return (
      <Link
        href={link}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={buttonClasses}
      >
        <div>{children}</div>
      </Link>
    );
  } else {
    return <div className={buttonClasses}>{children}</div>;
  }
};

export default CtaButton;
