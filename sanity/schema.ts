// Sanity v3 schema - to be used when Sanity Studio is set up
// Content migration: manually enter from old-website-data

export const articleSchema = {
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", type: "text" },
    { name: "body", type: "array", of: [{ type: "block" }] },
    { name: "author", type: "string" },
    { name: "artist", type: "string" },
    { name: "category", type: "string", options: { list: ["Brain Disorders", "Neurotechnology", "Cognition", "Cognition & Memory"] } },
    { name: "publishedAt", type: "datetime" },
    { name: "readingTime", type: "number" },
    { name: "featuredImage", type: "image" },
  ],
};

export const episodeSchema = {
  name: "episode",
  title: "Episode",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug" },
    { name: "guestName", type: "string" },
    { name: "guestTitle", type: "string" },
    { name: "duration", type: "string" },
    { name: "audioUrl", type: "url" },
    { name: "publishedAt", type: "datetime" },
    { name: "coverImage", type: "image" },
  ],
};

export const teamMemberSchema = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "role", type: "string" },
    { name: "interest", type: "string" },
    { name: "image", type: "image" },
  ],
};

export const chapterSchema = {
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "university", type: "string" },
    { name: "url", type: "url" },
    { name: "memberCount", type: "number" },
    { name: "lat", type: "number" },
    { name: "lng", type: "number" },
  ],
};

export const signalFeedSchema = {
  name: "signalFeed",
  title: "Signal Feed",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "excerpt", type: "text" },
    { name: "url", type: "url" },
    { name: "publishedAt", type: "datetime" },
  ],
};

export const researchSpotlightSchema = {
  name: "researchSpotlight",
  title: "Research Spotlight",
  type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "role", type: "string" },
    { name: "lab", type: "string" },
    { name: "bio", type: "text" },
    { name: "image", type: "image" },
    { name: "links", type: "array", of: [{ type: "object", fields: [{ name: "url", type: "url" }, { name: "label", type: "string" }] }] },
  ],
};
