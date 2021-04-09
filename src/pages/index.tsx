import React from 'react';
import Layout from 'src/lib/components/Layout';
import { getProductsByCollection } from 'src/lib/state/shopify/services';
import { Products } from 'src/lib/state/shopify/queries';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { GetStaticPropsContext } from 'next';
import { getNextStaticProps } from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql, useQuery } from '@apollo/client';

const featuredPostsQuery = gql`
  query {
    posts(where: { categoryName: "featured" }) {
      nodes {
        title
        excerpt
        slug
        tags(where: { search: "collection-" }) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

interface HomeProps {
  postProducts: Record<string, Products>;
}

function Home({ postProducts }: HomeProps) {
  const { data } = useQuery<WPGraphQL.GetPostsQuery>(featuredPostsQuery);
  const posts = data?.posts?.nodes ?? [];

  return (
    <Layout>
      <h1>Home</h1>
      {posts.map((post) => (
        <h1>{post.title}</h1>
      ))}
    </Layout>
  );
}

async function getStaticProps(ctx: GetStaticPropsContext) {
  const client = getApolloClient(ctx);
  const { data } = await client.query({
    query: featuredPostsQuery,
  });

  const result = await getNextStaticProps(ctx);
}

export default Home;
