import React from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  blur?: boolean;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = "100%",
  delay = 0,
  duration = 0.5,
  blur = true,
  className = "",
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const mainControls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={{
          hidden: { 
            opacity: 0, 
            y: 32, 
            filter: blur ? "blur(8px)" : "none" 
          },
          visible: { 
            opacity: 1, 
            y: 0, 
            filter: blur ? "blur(0px)" : "none" 
          },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 1.2,
          delay: delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
