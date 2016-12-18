const Schema = require('graph.ql');
const Remarkable = require('remarkable');
let remarkable = new Remarkable();
const to_slug = require('to-slug-case');
const assign = require('object-assign');

var posts = [
  {
    title: "Post 1",
    slug: "post-1",
    date: "2016-12-17T00:00:00.000Z",
    body: "<p>Post 1</p>\n"
  },
  {
    title: "Post 2",
    slug: "post-2",
    date: "2016-12-17T00:00:00.000Z",
    body: "<p>Post 2</p>\n"
  }
];

module.exports = Schema (`

  scalar Date
  scalar Markdown

  type Post {
    title: String!
    date: Date!
    body: Markdown!
    slug: String!
  }

  input PostInput {
    title: String!
    date: Date!
    body: Markdown!
  }

  type Mutation {
    create_post (post: PostInput): Post
  }

  type Query {
    all_posts: [Post]
    find_post (slug: String): Post
  }

`, {
  Date: {
    serialize: (v) => {
      return new Date(v);
    },
    parse: (v) => {
      let date = new Date(v);
      return date.toISOString();
    }
  },
  Markdown: {
    serialize: (v) => {
      return v;
    },
    parse: (v) => {
      return remarkable.render(v);
    }
  },
  Mutation: {
    create_post: (mutation, args) => {
      let slug = to_slug(args.post.title);
      posts[slug] = assign(args.post, {
        slug: slug
      });
      return posts[slug];
    }
  },
  Query: {
    all_posts: (query, args) => {
      return Object.keys(posts).map((slug) => {
        return posts[slug];
      });
    },
    find_post: (query, args) => {
      let slug = args.slug;
      return posts.find((post) => {return post.slug === slug;});
    }
  }

});
