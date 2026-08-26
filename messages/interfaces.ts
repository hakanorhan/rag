export interface AppBarInterface {
  links: {
    linkAbout: {
      title: string;
      href: string;
    };
    linkHome: {
      title: string;
      href: string;
    };
    linkContact: {
      title: string;
      href: string;
    };
    linkCar: {
      title: string;
      href: string;
    };
  };
}

export interface NewsInterface {
  article: {
    category: string;
    date: string;
    readingTime: string;
    title: string;
    intro: string;
    imageAlt: string;
    caption: string;
    firstParagraph: string;
    sectionTitle: string;
    secondParagraph: string;
    overview: {
      title: string;
      itemDrive: string;
      itemComfort: string;
      itemDesign: string;
    };
  };
}

export interface HeroSearchInterface {
  search: {
    locationLabel: string;
    locationHint: string;
    dateLabel: string;
    dateValue: string;
    button: string;
  };
}

export interface FooterInterface {
  content: {
    description: string;
    linksTitle: string;
    links: {
      imprint: {
        title: string;
        href: string;
      };
      terms: {
        title: string;
        href: string;
      };
      privacy: {
        title: string;
        href: string;
      };
      careers: {
        title: string;
        href: string;
      };
    };
    socialTitle: string;
    copyright: string;
  };
}
