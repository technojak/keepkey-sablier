import { useEffect, useRef } from "react";

export function useInterval(callback: any, delay: number|null) {
    const savedCallback = useRef<Function>();
    useEffect(() => {
        savedCallback.current = callback;
    });
    useEffect(() => {
        if (delay === null) return
        function tick() {
            if (savedCallback.current) savedCallback.current();
        }
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
