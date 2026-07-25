import Image from "next/image";
import Link from "next/link";

interface RoleCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  color: string;
}

export default function RoleCard({
  title,
  description,
  image,
  href,
  color,
}: RoleCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer p-6 h-full">

        <div className="flex justify-between items-center">

          {/* <Image
            src={image}
            alt={title}
            width={90}
            height={90}
          /> */}

       <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
  <Image
    src={image}
    alt={title}
    width={78}
    height={78}
    className="object-contain"
  />
</div>

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}
          >
            →
          </div>

        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          {title}
        </h2>

        <p className="mt-3 text-gray-600 leading-7">
          {description}
        </p>

      </div>
    </Link>
  );
}