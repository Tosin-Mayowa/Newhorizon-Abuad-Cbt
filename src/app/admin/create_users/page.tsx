"use client";
import React from 'react';
import Link from "next/link";
import { ReactNode } from 'react';



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
                <h1>CREATE ACCOUNT </h1>
                <form id="createAccount">
                    <label htmlFor="fullName">FullName:</label>
                    <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" />

                    <label htmlFor="staffID">Matric No:</label>
                    <input type="text" id="Matric-No" name="staffID" placeholder="Enter your Matric Number" />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" />
                    
                   <button type="button"id="login" > <Link href="/quiz/create_quiz">Create account</Link></button>
                   
                   
                </form>
               
            </div>
        </>
    );
}

