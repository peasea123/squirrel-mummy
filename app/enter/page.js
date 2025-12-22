'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './enter.module.css';

export default function EnterPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('squirrel_auth', 'true');
        setError('');
        // Small delay to ensure state updates before navigation
        setTimeout(() => {
          router.push('/inner');
        }, 100);
      } else {
        setError('Access denied. The knowledge you seek remains veiled.');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>The Gate</h1>
        <p className={styles.instruction}>
          Only those who know may proceed.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            placeholder="Speak its name."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={styles.input}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Listening...' : 'Proceed'}
          </button>
        </form>

        {error && (
          <p className={styles.error}>{error}</p>
        )}
      </div>
    </div>
  );
}
