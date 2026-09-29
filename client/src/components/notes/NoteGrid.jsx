import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NoteCard from "./NoteCard.jsx";

/** Responsive note grid with shared layout transitions and staggered entrance. */
export default function NoteGrid({
  notes,
  view,
  onEdit,
  onChangeStatus,
  onDeleteForever,
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div layout={!reduceMotion} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <AnimatePresence mode="popLayout" initial={false}>
        {notes.map((note, index) => (
          <motion.div
            layout={!reduceMotion}
            key={note._id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : {
              x: [0, -6, 6, 0],
              scale: 0.76,
              opacity: 0,
              transition: {
                x: { duration: 0.22 },
                scale: { delay: 0.12, duration: 0.2 },
                opacity: { delay: 0.12, duration: 0.2 },
              },
            }}
            transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * 0.045 }}
          >
            <NoteCard
              note={note}
              view={view}
              onEdit={onEdit}
              onChangeStatus={onChangeStatus}
              onDeleteForever={onDeleteForever}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
