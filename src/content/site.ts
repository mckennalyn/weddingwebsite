// Edit this file directly to update the site's wedding content.
// No database or admin UI is involved in these values.

export const couple = {
  partnerOneFirstName: "McKenna",
  partnerTwoFirstName: "Colin",
  weddingDateISO: "2027-01-02", // YYYY-MM-DD
  weddingDateDisplay: "January 2, 2027",
  ceremonyTime: "4:00 PM", // update to your actual time
  venueName: "Siempre",
  venueAddress: "Draper, Utah",
  hashtag: "#McKennaAndColin",
};

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What should I wear?",
    answer:
      "Attire is formal / black-tie optional. We'd love to see everyone in their finest — black, white, and gold accents are always welcome, though certainly not required.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "We love your little ones, but our celebration will be an adults-only affair, with the exception of the wedding party.",
  },
  {
    question: "Is there parking at the venue?",
    answer:
      "Yes, complimentary on-site parking will be available. Details will be included on your invitation and in the days leading up to the wedding.",
  },
  {
    question: "By when should I RSVP?",
    answer:
      "Please RSVP through this site as soon as you're able, and no later than eight weeks before the wedding.",
  },
  {
    question: "Can I bring a plus-one?",
    answer:
      "We're only able to accommodate the guests named on your invitation. Please check the RSVP page to see who in your party has been invited.",
  },
];

export const registry: {
  name: string;
  description?: string;
  url: string;
}[] = [
  {
    name: "Amazon",
    description: "Our home registry",
    url: "https://www.amazon.com/wedding/share/example",
  },
  {
    name: "Zola",
    description: "Experiences & honeymoon fund",
    url: "https://www.zola.com/registry/example",
  },
];
