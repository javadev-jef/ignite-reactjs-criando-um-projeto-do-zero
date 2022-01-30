import { format, parseISO } from 'date-fns';
import { ptBR, } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { ReactElement } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();

  if (router.isFallback) {
    return <span>Carregando...</span>
  }

  const readTime = calculateReadTime(post);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.post}>
          <div className={styles.banner}>
            <img src={post.data.banner.url} />
          </div>
          <div className={styles.main}>
            <h1>{post.data.title}</h1>
            <div className={styles.post_info}>
              <div className={styles.info}>
                <FiCalendar />
                {format(parseISO(post.first_publication_date), 'PP', {locale: ptBR})}
              </div>
              <div className={styles.info}>
                <FiUser />
                {post.data.author}
              </div>
              <div className={styles.info}>
                <FiClock />
                {readTime}
              </div>
            </div>
            <div className={styles.content}>
              {renderPostContent(post)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderPostContent(post: Post): ReactElement[] {
  return post.data.content.map((content, index) => {
    return (
      <div key={index}>
        <h2>{content.heading}</h2>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body)}}
        />
      </div>
    );
  });
}

function calculateReadTime(post: Post): string {
  const words = post.data.content.reduce((sum, currentItem) => {

    const headerWords = currentItem.heading.split(' ').length;

    const bodyWords = currentItem.body.reduce((result, body) => {
      const words = body.text.split(' ').length;
      return result = result + words;
    }, 0);

    return (sum += headerWords + bodyWords);
  }, 0);

  return `${Math.ceil(words / 200)} min`;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  });

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const postResponse = await prismic.getByUID('posts', String(slug), {});

  const postData = postResponse.data;
  const postContent = postData.content.map(content => {
    return {
      heading: content.heading,
      body: content.body,
    }
  })

  const post: Post = {
    uid: postResponse.uid,
    first_publication_date: postResponse.first_publication_date,
    data: {
      author: postData.author,
      banner: {
        url: postData.banner.url
      },
      content: postContent,
      title: postResponse.data.title,
      subtitle: postResponse.data.subtitle
    }
  }

  return {
    props: {
      post
    }
  }
};
