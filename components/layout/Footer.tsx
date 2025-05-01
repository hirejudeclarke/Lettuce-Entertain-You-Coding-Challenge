import Link from "next/link";

interface FooterLink {
  name: string;
  url: string;
}

const links: FooterLink[] = [
  { name: "Frequent Diner", url: "https://judeclarke.com/" },
  { name: "Gift Cards", url: "https://judeclarke.com/" },
  { name: "Employment", url: "https://judeclarke.com/" },
  { name: "LEYE.COM", url: "https://judeclarke.com/" },
  { name: "Terms of Use", url: "https://judeclarke.com/" },
  { name: "Privacy Policy", url: "https://judeclarke.com/" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-6 flex justify-center z-100">
      <div className="w-11/12 flex flex-wrap justify-center sm:justify-between gap-y-4 text-sm text-center sm:text-left">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="mx-2 hover:underline transition-all"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
