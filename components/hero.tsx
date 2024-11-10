import Image from "next/image";
import MacalinIcon from "@/public/images/english-teacher-icon.jpg";

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-background rounded-lg shadow-md">
      <Image 
        src={MacalinIcon}
        alt="Macallin Icon"
        width={100}
        height={100}
      />
      <h1 className="text-3xl font-bold text-center text-foreground">
        Welcome to <span className="text-blue-500 font-bold">Macallin</span>
      </h1>
      <p className="text-lg text-center text-foreground">
        We make it easy to communicate and use technology.
      </p>
    </div>
  );
}
