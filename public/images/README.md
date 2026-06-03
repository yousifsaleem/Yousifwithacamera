# Portfolio Images

Put YS Photography images in this folder.

Use lowercase hyphenated filenames:

```text
graduation-cover.jpg
graduation-01.jpg
portrait-01.webp
```

Reference them in `src/data/projects.ts` like this:

```ts
coverImage: "/images/graduation-cover.jpg"
galleryImages: ["/images/graduation-01.jpg"]
```

Do not include `public` in the path. Do not use spaces in filenames.
