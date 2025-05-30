import { motion, AnimatePresence } from "framer-motion";

export const Loader = ({ height = "h-screen", width = "w-16" }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex items-center justify-center ${height}`}
      >
        <motion.div
          className={`${width} aspect-square  border-t-3 border-transparent  rounded-full`}
          style={{
            borderColor: "",
            borderTopColor: "#4B0082",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};