



"use client";
import Link from "next/link";


export default function AdminSignup() {
    return (
        <>
            <nav className="w-[60%] flex justify-center padding-20">
                <ul className="w-[60%] flex justify-between items-center">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                
                </ul>
            </nav>

            <div className="signup-container">
                <h1>WELCOME </h1>
                <form>
                    <label htmlFor="fullName">FullName:</label>
                    <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" />

                    <label htmlFor="staffID">Matric No:</label>
                    <input type="text" id="Matric-No" name="staffID" placeholder="Enter your Matric Number" />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" />
                     <Link href="/login">Have an account? click here!</Link>

                   <button type="button"id="login" > <Link href="/quiz/take">signup</Link></button>


                </form>
               
            </div>
        </>
    );
}
