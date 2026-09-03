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
    button: string;
    freeTextHelper: string;
    freeTextLabel: string;
    incompleteDateRange: string;
    invalidDateRange: string;
    locationLabel: string;
    locationPlaceholder: string;
    pickupDateLabel: string;
    placeholder: string;
    returnDateLabel: string;
  };
}

export interface CarsInterface {
  content: {
    button: string;
    description: string;
    enterSearch: string;
    freeTextHelper: string;
    freeTextLabel: string;
    incompleteDateRange: string;
    invalidDateRange: string;
    locationLabel: string;
    locationPlaceholder: string;
    minimumAge: string;
    noResults: string;
    perDay: string;
    pickupDateLabel: string;
    placeholder: string;
    requestError: string;
    rent: string;
    renting: string;
    rentSuccess: string;
    rentError: string;
    rentMissingDetails: string;
    rentNotAuthenticated: string;
    rentNotAvailable: string;
    returnDateLabel: string;
    title: string;
    years: string;
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
