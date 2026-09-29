import Quote from "../models/Quote.js";

const defaultQuotes = [
  { key: "gentle-reminder", label: "A gentle reminder", text: "Small steps still move you forward.", color: "honey", tilt: "left" },
  { key: "todays-thought", label: "Today's thought", text: "Make room for good things.", color: "peach", tilt: "right" },
  { key: "keep-this-close", label: "Keep this close", text: "You are doing better than you think.", color: "mint", tilt: "left" },
];

/** Add the shared workspace quotes once; later startups preserve database edits. */
export default async function seedQuotes() {
  await Quote.bulkWrite(defaultQuotes.map((quote) => ({
    updateOne: {
      filter: { key: quote.key },
      update: { $setOnInsert: quote },
      upsert: true,
    },
  })));
}
