// app/login/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

     try {
            // Replace with your actual backend login API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
     const data = await response.json();

            if (response.ok) {
                // Assuming your backend returns the user's role and a token/cookie is set
                const role = data.user.role; 
                
                if (role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (role === 'staff') {
                    router.push('/staff/dashboard');
                } else if (role === 'student') {
                    router.push('/student/dashboard'); 
                } else if (role === 'student') {
                    router.push('/student/dashboard');
                } else {
                    setError('Unknown user role. Please contact support.');
                }
            } else {
                setError(data.message || 'Login failed. Check your credentials.');
            }
        } catch (err) {
            setError('Network error. Could not connect to the server.');
        } finally {
            setLoading(false);
        } 
        };         
    return (
       <>
         <nav className="w-[60%] flex justify-center p-5">
          <ul className="w-[60%] flex justify-between items-center">
            <li>
              <Link href="/" className="text-[18px]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/adminsignup">signup</Link>
            </li> 
          </ul>
        </nav>
         <div className="login-container">
           <h1>Welcome back</h1>
            {error && <p className="text-red-600" role="alert">{error}</p>}

            <form onSubmit={handleSubmit} >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    <Link href="/admin/dashboabrd">Login</Link>
                </button>
            </form>
            
        </div>
       </>
    );
}
