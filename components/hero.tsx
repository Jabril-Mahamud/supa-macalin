import Image from "next/image"; // Import the Image component
import MacalinIcon from "@/public/images/english-teacher-icon.jpg"; // Import the icon
import Link from "next/link"; // Import Link for navigation

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-8 p-4 bg-blue-50 rounded-lg shadow-md">
      <Image 
        src={MacalinIcon} // Use the Image component with the src prop
        alt="Macallin Icon"
        width={100} // Set the desired width
        height={100} // Set the desired height
      />
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Welcome to <span className="text-green-500">Macallin</span>!
      </h1>
      <p className="text-lg text-center max-w-md mx-auto text-gray-800">
        We are here to help you <span className="font-bold text-purple-600">communicate</span> better and use technology with ease. 
        Let us support you in understanding and{" "}
        <Link href="/speaker" className="underline text-green-500 hover:text-green-700 transition duration-300">
          speaking clearly
        </Link>.
      </p>
    </div>
  );
}
