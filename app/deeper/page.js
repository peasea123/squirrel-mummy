'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './deeper.module.css';

export default function DeeperPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user came from the inner page
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
        <h1 className={styles.title}>The Tomb</h1>

        <div className={styles.textBlock}>
          <p>
            Deeper still you venture.
          </p>
          <p>
            The walls remember what flesh forgets.
          </p>
          <p>
            There is a reason some doors stay sealed.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.symbolBlock}>
          <p className={styles.symbol}>⬚ ⬚ ⬚</p>
        </div>

        <p className={styles.closing}>
          You have seen what was meant to be lost.
        </p>
      </div>
    </div>
  );
}
