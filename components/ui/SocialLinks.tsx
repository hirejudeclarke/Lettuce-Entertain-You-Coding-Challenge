import { FaFacebookSquare, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const SocialLinks = () => {
  return (
    <div className="flex gap-1">
      <Link
        href="https://judeclarke.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter size={34} color="#222222" />
      </Link>
      <Link href="https://judeclarke.com/" rel="noopener noreferrer">
        <FaInstagram size={34} color="#222222" />
      </Link>
      <Link href="https://judeclarke.com/" rel="noopener noreferrer">
        <FaFacebookSquare size={34} color="#222222" />
      </Link>
    </div>
  );
};

export default SocialLinks;
