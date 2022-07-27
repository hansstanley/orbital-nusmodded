import { useEffect, useMemo, useState } from "react";

export default function useInViewport(ref) {
  const [intersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    console.log(typeof ref, ref);
    if (!ref?.current) return;

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return intersecting;
}
