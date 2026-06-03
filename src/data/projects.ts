export type Project = {
  id: string;
  slug: string;
  title: string;
  subheading: string;
  year: string;
  tags: string[];
  coverImage: string;
  galleryImages: string[];
  alt: string;
  description: string;
  category: string;
};

// Image paths must point to files inside public/images/.
// Example: public/images/my-photo.jpg is referenced here as "/images/my-photo.jpg".
// Use lowercase, hyphenated filenames without spaces. Deployment environments can
// be case-sensitive, so work-01.jpg and Work-01.JPG may not be the same file.
// The components include visible fallbacks if an image is missing while you edit.
export const projects: Project[] = [
  {
    id: "graduation-portraits",
    slug: "graduation-portraits",
    title: "Graduation Portraits",
    subheading: "Portraits made for a milestone",
    year: "2026",
    tags: ["Portrait", "Graduation", "Dundee"],
    coverImage: "/images/work-01.jpg",
    galleryImages: ["/images/work-01.jpg", "/images/work-02.jpg", "/images/work-03.jpg"],
    alt: "Graduation portrait placeholder image.",
    description:
      "A quiet, polished approach to graduation photography with a focus on presence, detail, and atmosphere.",
    category: "Graduation"
  },
  {
    id: "personal-portraits",
    slug: "personal-portraits",
    title: "Personal Portraits",
    subheading: "Available-light studies of presence",
    year: "2026",
    tags: ["Portrait", "Available light"],
    coverImage: "/images/work-02.jpg",
    galleryImages: ["/images/work-02.jpg", "/images/work-04.jpg", "/images/work-07.jpg"],
    alt: "Personal portrait placeholder image.",
    description:
      "Portrait work with a restrained visual language: natural expression, available light, and direction that leaves room for presence.",
    category: "Portrait"
  },
  {
    id: "event-coverage",
    slug: "event-coverage",
    title: "Event Coverage",
    subheading: "Rooms, motion, and atmosphere",
    year: "2026",
    tags: ["Event", "Atmosphere"],
    coverImage: "/images/work-03.jpg",
    galleryImages: ["/images/work-03.jpg", "/images/work-01.jpg", "/images/work-06.jpg"],
    alt: "Event coverage placeholder image.",
    description:
      "Event coverage observed through atmosphere, movement, rooms, gestures, and the details that hold a gathering together.",
    category: "Event"
  },
  {
    id: "street-studies",
    slug: "street-studies",
    title: "Street Studies",
    subheading: "Observed rhythm in public space",
    year: "2026",
    tags: ["Street", "Observation"],
    coverImage: "/images/work-04.jpg",
    galleryImages: ["/images/work-04.jpg", "/images/work-05.jpg", "/images/work-02.jpg"],
    alt: "Street photography placeholder image.",
    description:
      "Street studies built from passing scenes, layered geometry, soft interruptions, and the rhythm of people moving through space.",
    category: "Street"
  },
  {
    id: "nature-observations",
    slug: "nature-observations",
    title: "Nature Observations",
    subheading: "Texture, stillness, and weather",
    year: "2026",
    tags: ["Nature", "Texture"],
    coverImage: "/images/work-05.jpg",
    galleryImages: ["/images/work-05.jpg", "/images/work-06.jpg", "/images/work-07.jpg"],
    alt: "Nature observation placeholder image.",
    description:
      "Nature observations focused on texture, patience, muted colour, and small environmental shifts that ask for a slower look.",
    category: "Nature"
  },
  {
    id: "landscape-work",
    slug: "landscape-work",
    title: "Landscape Work",
    subheading: "Distance, horizon, and quiet scale",
    year: "2026",
    tags: ["Landscape", "Distance"],
    coverImage: "/images/work-06.jpg",
    galleryImages: ["/images/work-06.jpg", "/images/work-05.jpg", "/images/work-01.jpg"],
    alt: "Landscape work placeholder image.",
    description:
      "Landscape work exploring distance, horizon, weather, and the cinematic quiet of open scenes.",
    category: "Landscape"
  },
  {
    id: "quiet-frames",
    slug: "quiet-frames",
    title: "Quiet Frames",
    subheading: "Atmosphere without announcement",
    year: "2026",
    tags: ["Study", "Atmosphere"],
    coverImage: "/images/work-07.jpg",
    galleryImages: ["/images/work-07.jpg", "/images/work-04.jpg", "/images/work-02.jpg"],
    alt: "Quiet frame placeholder image.",
    description:
      "A group of quieter frames where composition, timing, and atmosphere carry the subject without needing to announce it.",
    category: "Study"
  }
];
