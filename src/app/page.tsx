import Image from "next/image";

// default export -- can import with any name
export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-6xl mt-8 mx-4">hi</h2>
      <Image
        src="https://http.cat/200"
        alt="http-200-okay-status-cat"
        width={400}
        height={400}
      />
    </div>
  );
}
