'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './deeper.module.css';

export default function DeeperPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clickSequence, setClickSequence] = useState([]);
  const correctSequence = ['left', 'right', 'center'];

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

  const handleBoxClick = (boxId) => {
    const newSequence = [...clickSequence, boxId];
    setClickSequence(newSequence);

    // Play squirrel sound
    const squirrelAudio = new Audio('/squirrel.m4a');
    squirrelAudio.volume = 0.5;
    squirrelAudio.play().catch(() => {});

    // Check if the sequence is correct so far
    if (newSequence[newSequence.length - 1] !== correctSequence[newSequence.length - 1]) {
      // Wrong sequence - reset after 500ms
      setTimeout(() => {
        setClickSequence([]);
      }, 500);
      return;
    }

    // If sequence is complete and correct
    if (newSequence.length === correctSequence.length) {
      // Play final squirrel sound
      setTimeout(() => {
        const finalAudio = new Audio('/squirrel.m4a');
        finalAudio.volume = 0.7;
        finalAudio.play().catch(() => {});
      }, 300);

      // Navigate to the abyss
      setTimeout(() => {
        router.push('/abyss');
      }, 1000);
    }
  };

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

        <div className={styles.hiddenButtonsContainer}>
          <button 
            className={`${styles.hiddenButton} ${styles.left} ${clickSequence.includes('left') ? styles.active : ''}`}
            onClick={() => handleBoxClick('left')}
          />
          <button 
            className={`${styles.hiddenButton} ${styles.right} ${clickSequence.includes('right') ? styles.active : ''}`}
            onClick={() => handleBoxClick('right')}
          />
          <button 
            className={`${styles.hiddenButton} ${styles.center} ${clickSequence.includes('center') ? styles.active : ''}`}
            onClick={() => handleBoxClick('center')}
          />
        </div>
      </div>
    </div>
  );
}
