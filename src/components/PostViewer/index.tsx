import styles from './post-viewer.module.scss';
import PostSummary from '../PostSummary';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostViewProps {
  posts: Post[];
  nextPage: string;
}

export default function PostViewer(postsProps: PostViewProps) {

  const [posts, setPosts] = useState(formatPosts(postsProps.posts));
  const [nextPage, setNextPage] = useState(postsProps.nextPage);

  function loadMore(): void {
    fetch(postsProps.nextPage)
    .then(response => response.json())
    .then(data => {
      const postsResponse: ApiSearchResponse = data;
      const newPosts = postsResponse.results.map(post => {
        return {
          uid: post.uid,
          first_publication_date: format(parseISO(post.first_publication_date), 'PP', {locale: ptBR}),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          }
        }
      });

      setPosts([...posts, ...newPosts]);
      setNextPage(postsResponse.next_page);
    });
  }

  return (
    <div className={styles.container}>
      {posts.map(post => <PostSummary post={post} key={post.uid}/>)}
      {nextPage
        ?
          <button type='button' onClick={loadMore}>
            Carregar mais posts
          </button>
        :
          ''
      }
    </div>
  );
}

function formatPosts(posts: Post[]): Post[] {
  return posts.map(post => {
    return {
      ...post,
      first_publication_date: format(parseISO(post.first_publication_date), 'PP', {locale: ptBR})
    }
  });
}
