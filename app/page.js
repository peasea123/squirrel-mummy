'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './landing.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src="/SquirrelMummy.png"
          alt="Squirrel Mummy"
          fill
          priority
          quality={90}
          className={styles.image}
        />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.content}>
        <p className={styles.subtext}>Some mysteries are not meant to be solved.</p>
      </div>

      <Link href="/enter" className={styles.enterButton}>
        <button>ENTER</button>
      </Link>
    </div>
  );
}
