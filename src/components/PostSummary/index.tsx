import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './post-summary.module.scss';
import Link from 'next/link';

interface PostSummary {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostSummaryProps {
  post: PostSummary;
}

export default function PostSummary({ post }: PostSummaryProps) {
  return (
    <Link key={post.uid} href={`/post/${post.uid}`}>
      <div className={styles.post_summary}>
        <h2 className={styles.title}>
          {post.data.title}
        </h2>
        <p className={styles.subtitle}>
          {post.data.subtitle}
        </p>
        <div className={styles.info_group}>
          <div className={styles.info}>
            <FiCalendar />
            {post.first_publication_date}
          </div>
          <div className={styles.info}>
            <FiUser />
            {post.data.author}
          </div>
        </div>
      </div>
    </Link>
  );
}
