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
    if (clickSequence.length >= 3) return; // Prevent more clicks after 3

    const newSequence = [...clickSequence, boxId];
    setClickSequence(newSequence);

    // If this is the 3rd click, check if sequence is correct
    // Visual positions left-to-right: 1=left, 2=center, 3=right
    // Required click order: 1 → 3 → 2 (left → right → center)
    if (newSequence.length === 3) {
      const isCorrect = 
        newSequence[0] === 'left' && 
        newSequence[1] === 'right' && 
        newSequence[2] === 'center';

      if (isCorrect) {
        // Correct sequence - play sound and navigate after delay
        setTimeout(() => {
          const squirrelAudio = new Audio('/squirrel.m4a');
          squirrelAudio.volume = 0.7;
          squirrelAudio.play().catch(() => {});
        }, 300);

        setTimeout(() => {
          router.push('/abyss');
        }, 1500);
      } else {
        // Wrong sequence - dim buttons and reset after 1.5 seconds
        setTimeout(() => {
          setClickSequence([]);
        }, 1500);
      }
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
          {/* Hidden button sequence (visual positions left to right = 1, 2, 3): 1 → 3 → 2 = LEFT → RIGHT → CENTER */}
          <button 
            className={`${styles.hiddenButton} ${clickSequence.includes('left') ? styles.active : ''} ${clickSequence.length === 3 && (clickSequence[0] !== 'left' || clickSequence[1] !== 'right' || clickSequence[2] !== 'center') ? styles.incorrect : ''}`}
            onClick={() => handleBoxClick('left')}
            title="⬚"
          />
          <button 
            className={`${styles.hiddenButton} ${clickSequence.includes('center') ? styles.active : ''} ${clickSequence.length === 3 && (clickSequence[0] !== 'left' || clickSequence[1] !== 'right' || clickSequence[2] !== 'center') ? styles.incorrect : ''}`}
            onClick={() => handleBoxClick('center')}
            title="⬚"
          />
          <button 
            className={`${styles.hiddenButton} ${clickSequence.includes('right') ? styles.active : ''} ${clickSequence.length === 3 && (clickSequence[0] !== 'left' || clickSequence[1] !== 'right' || clickSequence[2] !== 'center') ? styles.incorrect : ''}`}
            onClick={() => handleBoxClick('right')}
            title="⬚"
          />
        </div>
      </div>
    </div>
  );
}
