'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './inner.module.css';

export default function InnerPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [motionPermissionRequested, setMotionPermissionRequested] = useState(false);
  const [shakeDetectedVisual, setShakeDetectedVisual] = useState(false);

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

  // Keyboard shortcut: Ctrl+S+M
  useEffect(() => {
    if (!isAuthorized) return;

    const keys = {};
    
    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
      
      if (keys['control'] && keys['s'] && keys['m']) {
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

  // Mobile: Shake detection + 3-finger swipe
  useEffect(() => {
    if (!isAuthorized || !motionPermissionRequested) return;

    let shakeTimer = null;
    let countdownInterval = null;
    let countdownStarted = false;

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

    const handleDeviceMotion = (e) => {
      if (!e.accelerationIncludingGravity) return;

      const { x, y, z } = e.accelerationIncludingGravity;
      
      // Calculate total acceleration magnitude
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      // Normal gravity is ~9.8, shake will be significantly higher or lower
      // If magnitude deviates more than 5 from 9.8, it's likely shaking
      const gravityDeviation = Math.abs(magnitude - 9.8);

      if (gravityDeviation > 5) {
        setShakeDetectedVisual(true);
        
        // Play squirrel sound while shaking
        const squirrelAudio = new Audio('/squirrel.m4a');
        squirrelAudio.volume = 0.5;
        squirrelAudio.play().catch(() => {});

        // Start countdown on first detection
        if (!countdownStarted) {
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
            }
          }, 1000);

          // Reset after countdown
          setTimeout(() => {
            countdownStarted = false;
            setShakeDetectedVisual(false);
            clearInterval(soundInterval);
          }, 3000);
        }
      } else {
        setShakeDetectedVisual(false);
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCount = 0;

    const handleTouchStart = (e) => {
      touchCount = e.touches.length;
      if (touchCount === 3) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (countdown <= 0 || touchCount !== 3) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Check for upward swipe
      if (Math.abs(diffY) > 100 && diffY < 0 && Math.abs(diffX) < 50) {
        router.push('/deeper');
        shakeActive = false;
        setCountdown(0);
        if (shakeTimer) clearTimeout(shakeTimer);
        if (countdownInterval) clearInterval(countdownInterval);
      }

      touchCount = 0;
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (shakeTimer) clearTimeout(shakeTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isAuthorized, motionPermissionRequested, router]);

  // Request motion permission for iOS 13+
  const requestMotionPermission = async () => {
    // Just enable it directly - don't request permission
    setMotionPermissionRequested(true);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Play squirrel sound to confirm
    const squirrelAudio = new Audio('/squirrel.m4a');
    squirrelAudio.volume = 0.8;
    squirrelAudio.play().catch(e => console.error('Sound failed:', e));
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

        {!motionPermissionRequested && (
          <button 
            onClick={requestMotionPermission}
            className={styles.permissionButton}
          >
            Enable Device Motion
          </button>
        )}

        {motionPermissionRequested && (
          <div className={styles.statusIndicator}>
            <p>🫖 Shake enabled. Device listening.</p>
          </div>
        )}

        {shakeDetectedVisual && (
          <div className={styles.shakeIndicator}>
            <p>SHAKING...</p>
          </div>
        )}
      </div>
    </div>
  );
}
