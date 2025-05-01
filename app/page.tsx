import About from "@/components/layout/About";
import Reservation from "@/components/layout/Reservation";
import Events from "@/components/layout/Events";
import ContactUs from "@/components/layout/ContactUs";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center">
        <About />
      </div>
      <Reservation />
      <Events />
      <ContactUs />
    </div>
  );
}
