import { motion } from "framer-motion";

export const notePalette = {
  violet: "#2FAF9A",
  mint: "#FF9F86",
  coral: "#FDF2F0",
  navy: "#1B3A3C",
};

const colors = Object.keys(notePalette);
const colorLabels = { violet: "Aqua Alloy", mint: "Peach Shell", coral: "Mist Porcelain", navy: "Shadow Ink" };

/** Select one of the four brand colors for a note. */
export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Note color">
      {colors.map((color) => (
        <motion.button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color || (value === "gold" && color === "violet")}
          aria-label={`${colorLabels[color]} note color`}
          title={colorLabels[color]}
          onClick={() => onChange(color)}
          className="relative grid h-9 w-9 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <span className="h-6 w-6 rounded-full" style={{ backgroundColor: notePalette[color] }} />
          {(value === color || (value === "gold" && color === "violet")) && (
            <motion.span
              layoutId="note-color-selection"
              className="absolute inset-0 rounded-full border-2 border-white/90"
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
