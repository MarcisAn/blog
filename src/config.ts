import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://marcisan.vercel.app", // replace this with your deployed domain
  author: "Mārcis",
  desc: "",
  title: "Mārcis  blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = {
  lang: "lv", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/MarcisAn",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  }
];
