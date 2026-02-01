import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-10 mt-4 text-sm flex flex-col items-center">
      <div className="flex flex-row space-x-4">
        {/* can't use lucide-react icons here because they don't accept brand icons */}
        {/* https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder */}
        {/* public folder must be in root */}
        {/* "Files inside public can then be referenced by your code starting from the base URL (/)."" */}
        {/* i.e. don't put /public in src="" */}
        <Link
          href="https://github.com/jevontrei/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/github.svg" alt="GitHub logo" width={24} height={24} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/joel-von-treifeldt/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/linkedin-logo-svgrepo-com.svg"
            alt="LinkedIn logo"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <p className="mt-4">&copy; JVT 2026</p>
    </footer>
  );
}
