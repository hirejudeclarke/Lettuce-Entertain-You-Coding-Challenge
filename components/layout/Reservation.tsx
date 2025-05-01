import Image from "next/image";
import ReservationForm from "../forms/ReservationForm";

const Reservation = () => {
  return (
    <div className="bg-brand-gray flex overflow-hidden justify-center md:justify-normal py-8 md:py-0 transition-[padding] duration-600 ease-in-out">
      <div className="md:flex-1 lg:flex-4 flex items-center p-3 lg:p-[4%] sm:p-8 md:justify-end">
        <ReservationForm />
      </div>
      <div className="md:flex-1 lg:flex-6 hidden md:flex ">
        <Image
          src="/assets/MAG-Salmon_Anjali Pinto.jpg"
          alt=""
          width={600}
          height={300}
          className="h-full lg:w-full object-cover object-right"
        />
      </div>
    </div>
  );
};

export default Reservation;
