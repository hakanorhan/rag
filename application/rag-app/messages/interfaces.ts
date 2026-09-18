export interface AppBarInterface {
  links: {
    linkAbout: {
      title: string;
      href: "/about-us";
    };
    linkHome: {
      title: string;
      href: "/";
    };
    linkContact: {
      title: string;
      href: "/contact";
    };
    linkFleet: {
      title: string;
      href: "/fleet";
    };
    linkReservations: {
      title: string;
      href: "/my-reservations";
    };
    linkAdmin: {
      title: string;
      href: "/admin/rag/edit";
    };
    linkAiProvider: {
      title: string;
      href: "/admin/ai";
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
  title: string;
  search: {
    button: string;
    criteriaModeLabel: string;
    freeTextHelper: string;
    freeTextLabel: string;
    freeTextModeLabel: string;
    incompleteDateRange: string;
    invalidDateRange: string;
    locationLabel: string;
    locationRequired: string;
    locationPlaceholder: string;
    returnLocationLabel: string;
    returnLocationRequired: string;
    pickupDateLabel: string;
    placeholder: string;
    returnDateLabel: string;
  };
}

export interface CarsInterface {
  content: {
    ageFilter: string;
    allAges: string;
    button: string;
    criteriaModeLabel: string;
    description: string;
    enterSearch: string;
    freeTextHelper: string;
    freeTextLabel: string;
    freeTextModeLabel: string;
    incompleteDateRange: string;
    invalidDateRange: string;
    locationLabel: string;
    locationRequired: string;
    locationPlaceholder: string;
    returnLocationLabel: string;
    returnLocationRequired: string;
    minimumAge: string;
    noFilterResults: string;
    noResults: string;
    perDay: string;
    priceAscending: string;
    priceDescending: string;
    pickupDateLabel: string;
    placeholder: string;
    rent: string;
    renting: string;
    rentSuccess: string;
    rentError: string;
    rentMissingDetails: string;
    rentNotAuthenticated: string;
    rentNoCustomerAccount: string;
    rentNotAvailable: string;
    returnDateLabel: string;
    sort: string;
    sortDefault: string;
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
