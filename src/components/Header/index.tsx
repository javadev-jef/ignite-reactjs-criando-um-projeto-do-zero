import Logo from "../Logo";
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Link href='/'>
          <a><Logo /></a>
        </Link>
      </div>
    </div>
  );
}
