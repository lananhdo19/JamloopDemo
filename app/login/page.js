'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', { email, password, redirect: false });

        if (result?.error) {
            setError('Invalid email or password.');
        } else {
            router.push('/campaigns');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-orange-500">Jamloop</h1>
                    <p className="text-sm text-gray-500 mt-1">Campaign Management Platform</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
                        >
                            Sign in
                        </button>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Demo accounts</p>
                            <button
                                type="button"
                                onClick={() => { setEmail('synergy@corp.com'); setPassword('synergy2024'); }}
                                className="w-full bg-gray-300 hover:bg-gray-200 text-white font-medium py-2 px-4 rounded text-sm transition-colors mb-2"
                            >Synergy Corp</button>
                            <button
                                type="button"
                                onClick={() => { setEmail('global@media.com'); setPassword('global2024'); }}
                                className="w-full bg-gray-300 hover:bg-gray-200 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
                            >Global Media</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
