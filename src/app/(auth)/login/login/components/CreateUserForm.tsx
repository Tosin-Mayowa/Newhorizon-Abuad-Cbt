// components/CreateUserForm.tsx
'use client';

import { useState } from 'react';
import styles from './CreateUserForm.module.css';

export default function CreateUserForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // Default to student
        MatricNumber: '',
    });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ message: '', type: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            // Replace with your actual backend user creation API endpoint
            const response = await fetch('/api/admin/create-user', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // CRITICAL: Must include the Admin's JWT/Session token for authorization!
                    // 'Authorization': `Bearer ${adminToken}` 
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ message: data.message || `${formData.role} created successfully!`, type: 'success' });
                // Clear the form fields upon success
                setFormData({ name: '', email: '', password: '', role: 'student', MatricNumber: '' });
            } else {
                setStatus({ message: data.message || 'Failed to create user. Check server logs.', type: 'error' });
            }
        } catch (err) {
            setStatus({ message: 'Network error or server connection failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.formContainer}>
            <h2>Create New Account</h2>
            {status.message && (
                <p className={status.type === 'error' ? styles.errorMessage : styles.successMessage}>
                    {status.message}
                </p>
            )}

            <form onSubmit={handleSubmit} >
        

                {/* Name, Email, Password Fields */}
                <label >Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required  /></label>
                <label >Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required  /></label>
                <label >Password: <input type="password" name="password" value={formData.password} onChange={handleChange} required /></label>

                {/* School ID Field (e.g., Reg. Number / Staff ID) */}
                <label >
                    {formData.role === 'student' ? 'Student ID (Reg No.):' : 'Staff ID:'}
                    <input type="text" name="schoolId" value={formData.MatricNumber} onChange={handleChange} required  />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating User...' : `Create ${formData.role} Account`}
                </button>
            </form>
        </div>
    );
}