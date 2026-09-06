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
  rsvpByDisplay: "December 5, 2026", // update to your actual RSVP deadline
};

export const schedule: { time: string; label: string }[] = [
  { time: "4:00 PM", label: "Ceremony" },
  { time: "4:20 PM", label: "Cocktail Hour" },
  { time: "5:00 PM", label: "Dinner" },
  { time: "7:00 PM", label: "Send-Off" },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What should I wear?",
    answer: "Attire is formal dress.",
  },
  {
    question: "Can I bring my children? / Can I bring a plus-one?",
    answer:
      "We kindly ask that you only bring guests included on your invitation. Your RSVP page will reflect everyone invited in your party.",
  },
  {
    question: "Is there parking at the venue?",
    answer: "Yes, on-site parking will be available at the venue.",
  },
  {
    question: "By when should I RSVP?",
    answer: `Please reply through this site by ${couple.rsvpByDisplay}, so we can finalize our arrangements.`,
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
    url: "https://www.amazon.com/wedding/guest-view/T0TDYE1SGHZ2",
  },
  {
    name: "Zola",
    description: "Honeymoon fund",
    url: "https://www.zola.com/registry/example",
  },
];
