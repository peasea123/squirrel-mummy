'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './inner.module.css';

export default function InnerPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if user came from the password gate
    const checkAuth = async () => {
      const sessionPassword = sessionStorage.getItem('squirrel_auth');
      
      if (sessionPassword) {
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Keyboard shortcut: Alt+S+M (Squirrel + Mummy)
  useEffect(() => {
    if (!isAuthorized) return;

    const keys = {};
    
    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
      
      if (keys['alt'] && keys['s'] && keys['m']) {
        e.preventDefault();
        router.push('/deeper');
      }
    };
    
    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAuthorized, router]);

  // Mobile/Desktop: 3-finger swipe to trigger countdown
  useEffect(() => {
    if (!isAuthorized) return;

    let countdownInterval = null;

    // Play a beep sound
    const playBeep = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCount = 0;
    let countdownStarted = false;

    const handleTouchStart = (e) => {
      touchCount = e.touches.length;
      if (touchCount === 3) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (countdownStarted || touchCount !== 3) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Check for upward swipe (at least 100px upward, less than 50px sideways)
      if (Math.abs(diffY) > 100 && diffY < 0 && Math.abs(diffX) < 50) {
        countdownStarted = true;
        playBeep();
        setCountdown(3);

        // Play squirrel sound on interval during countdown
        let soundInterval = setInterval(() => {
          const squirrelAudio = new Audio('/squirrel.m4a');
          squirrelAudio.volume = 0.6;
          squirrelAudio.play().catch(() => {});
        }, 750);

        // Countdown from 3 to 0
        let count = 3;
        countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          
          if (count <= 0) {
            clearInterval(countdownInterval);
            clearInterval(soundInterval);
            setCountdown(0);
            // Navigate to deeper page after countdown
            router.push('/deeper');
          }
        }, 1000);

        // Reset after countdown
        setTimeout(() => {
          countdownStarted = false;
          clearInterval(soundInterval);
        }, 3000);
      }

      touchCount = 0;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isAuthorized, router]);

  // Request motion permission for iOS 13+
  // (Simplified: Just inform users about 3-finger swipe gesture)

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
        <h1 className={styles.title}>The Archive</h1>

        <div className={styles.textBlock}>
          <p>
            Found. Preserved. Forgotten.
          </p>
          <p>
            In the walls, secrets wait. Some are better left undisturbed.
          </p>
          <p>
            You have passed beyond the threshold. What you know now, you carry forever.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.symbolBlock}>
          <p className={styles.symbol}>◆ ◆ ◆</p>
        </div>

        <p className={styles.closing}>
          Speak of this to no one.
        </p>

        {countdown > 0 && (
          <div className={styles.countdownOverlay}>
            <div className={styles.countdownText}>
              <p>Three fingers. Swipe upward.</p>
              <p className={styles.countdown}>{countdown}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
