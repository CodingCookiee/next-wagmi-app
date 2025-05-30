import { motion } from "framer-motion";

export const LoadingDots = ({ height = "h-10", width = "w-10" }) => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
        className={`${height} ${width} h-2 bg-indigo-700 rounded-full `}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  );
};

