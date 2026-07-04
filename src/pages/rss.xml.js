import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ id, data }) => id.startsWith('de/') && !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Nordweg — Die Chronik der Wikinger',
    description: 'Geschichte, Mythologie und die Klänge des hohen Nordens.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      categories: [post.data.category, ...post.data.tags],
      link: `/blog/${post.slug.replace(/^de\//, '')}/`,
    })),
    customData: `<language>de-de</language>`,
  });
}
