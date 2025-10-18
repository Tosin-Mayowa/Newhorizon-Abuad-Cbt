



import Link from "next/link";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any;
            h1: any;
            form: any;
            label: any;
            input: any;
            button: any;
        }
    }
}

export default function Login() {
    return (
       <>
         <nav className="w-[60%]  flex justify-center padding-20">
          <ul className="w-[60%]  flex justify-between items-center">
            <li className="">
              <Link href="/" className=" text-[18px]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <div className="login-container">
            <h1>Welcome</h1>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Enter your username" />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="Enter your password" />
                <button type="submit">Login</button>
            </form>
        </div>
      </>
    );
}
