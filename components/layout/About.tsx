import Image from "next/image";

const desktopImageClasses: string =
  "w-full h-auto object-cover lg:pl-15 lg:pt-5";
const mobileImageClasses: string = "object-cover";

const About = () => {
  return (
    <div className="flex flex-col lg:flex-row py-14 px-4 sm:px-8 lg:px-0 max-w-[1220px] gap-8 lg:gap-0">
      <div className="flex-1 flex flex-wrap items-start h-[30%]">
        <div className="w-full flex gap-2 justify-center flex-wrap lg:hidden">
          <div className="flex gap-2">
            <Image
              src="/assets/about-hero-1.png"
              alt="An image of various appetizers on a counter"
              width={96}
              height={160}
              className={`${mobileImageClasses}`}
            />
            <Image
              src="/assets/about-hero-2.png"
              alt="An image of various appetizers on a counter"
              width={128}
              height={160}
              className={`${mobileImageClasses}`}
            />
          </div>

          <Image
            src="/assets/about-hero-3.png"
            alt="An image of various appetizers on a counter"
            width={310}
            height={160}
            className={`${mobileImageClasses}`}
          />
        </div>
        <Image
          src="/assets/desktop-about-image.svg"
          alt="An image of tomatoes, an image of cheese being grated, and an image of various appetizers on a counter"
          width={600}
          height={400}
          className={`${desktopImageClasses} hidden lg:block`}
        />
      </div>

      <div className="flex-1 flex items-end">
        <div className="lg:pr-24 lg:pb-16 lg:pl-16 flex flex-col gap-7 leading-5 sm:leading-6">
          <h1 className="font-accent text-3xl sm:text-4xl text-center lg:text-left">
            About <span className="lg:hidden">Us</span>
          </h1>
          <p>
            Mon Ami Gabi is a classic French bistro that embraces a passion for
            food, wine and culture. Whether you come for the Onion Soup Au
            Gratin, Steak Frites or decadent Profiteroles, Mon Ami Gabi offers
            something to satisfy all tastes. For those looking to indulge in a
            unique dish, the Escargots de Bourgogne with garlic-herb butter is
            literally a sizzling experience.
          </p>
          <p>
            To complement the menu, an extensive selection of more than 80
            boutique French wine varietals, handpicked by renowned chef and
            owner Gabino Sotelino, are served by the glass or bottle from our
            signature rolling wine cart.
          </p>
          <p>
            While the favorites are here in abundance, there&apos;s always
            something new when you&apos;re ready to fall in love all over again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
