import { FaFacebookSquare, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { myLink } from "@/data/links";

const SocialLinks = () => {
  return (
    <div className="flex gap-1">
      <Link href={myLink} target="_blank" rel="noopener noreferrer">
        <FaTwitter size={34} color="#222222" />
      </Link>
      <Link href={myLink} rel="noopener noreferrer">
        <FaInstagram size={34} color="#222222" />
      </Link>
      <Link href={myLink} rel="noopener noreferrer">
        <FaFacebookSquare size={34} color="#222222" />
      </Link>
    </div>
  );
};

export default SocialLinks;
