import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-screen h-full">
      <header className="bg-primary text-white border border-solid border-black w-full lg:h-[80px] flex justify-around items-center">
        <h1 className="lg:text-[30px] font-bold">CBT-App</h1>
        <nav className="w-[60%] h-full border border-solid border-red-500 flex justify-end">
          <ul className="w-[60%] h-full flex justify-between items-center">
            <li className="">
              <Link href="/" className="font-extrabold text-[18px]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <Link href="/login">Login</Link>
          </ul>
        </nav>
      </header>
      {/* Home page content */}
      <div className="flex justify-between lg:h-full w-full bg-foreground">
        <div className="lg:w-[60%] lg:h-full flex flex-col justify-center border border-solid border-black pl-4">
          <h1 className="lg:text-[40px]  text-secondary font-bold">🎓 Welcome to <span className="text-primary">New Horizon</span>  CBT Portal</h1>
          <div className="w-[80%] lg:h-[25%]  self-center flex flex-col justify-between border border-solid border-black">
           <div>
             <h3 className="lg:text-[20px] text-primary font-bold ">Powered in Partnership with Afe Babalola University (ABUAD)</h3>
          <p className="lg:text-[16px] text-primary font-light ">
            Prepare, Practice, and Perform with Confidence. Our Computer-Based
            Test (CBT) platform is designed to deliver a smooth, secure, and
            efficient examination experience for every student.
          </p>
           </div>
          <button className="lg:w-[50%] bg-primary lg:h-[40px] rounded-[8px] text-white font-bold cursor-pointer">Learn More</button>
          </div>
        </div>
        <div></div>
      </div>
    </section>
  );
}
