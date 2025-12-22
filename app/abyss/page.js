'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './abyss.module.css';

export default function AbyssPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user came from the deeper page
    const checkAuth = async () => {
      const sessionPassword = sessionStorage.getItem('squirrel_auth');
      
      if (sessionPassword) {
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    router.push('/enter');
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>The Abyss</h1>

        <div className={styles.textBlock}>
          <p>
            Beyond the tomb lies only silence.
          </p>
          <p>
            You have crossed the final threshold.
          </p>
          <p>
            There is no going back from this knowledge.
          </p>
          <p>
            The squirrel remembers. The squirrel knows.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.symbolBlock}>
          <p className={styles.symbol}>∞</p>
        </div>

        <p className={styles.closing}>
          You are now one of us.
        </p>

        <div className={styles.reward}>
          <p className={styles.rewardLabel}>The Reward:</p>
          <p className={styles.rewardText}>Fuzzy Tail</p>
        </div>
      </div>
    </div>
  );
}
