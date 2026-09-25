import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  speed?: number;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

const ParallaxSection = ({
  children,
  backgroundImage,
  backgroundColor,
  speed = 0.5,
  className = "",
  overlay = true,
  overlayOpacity = 0.4,
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 20}%`, `${speed * 20}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div
          style={{ y }}
          className="absolute inset-0 -top-[20%] -bottom-[20%]"
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div
              className="absolute inset-0 bg-background"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </motion.div>
      )}
      {backgroundColor && !backgroundImage && (
        <motion.div
          style={{ backgroundColor, y }}
          className="absolute inset-0 -top-[10%] -bottom-[10%]"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ParallaxSection;