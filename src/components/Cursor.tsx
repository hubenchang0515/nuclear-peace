import { Box, SxProps, Theme } from "@mui/material";
import './Cursor.css'
import { useEffect, useRef } from "react";

export interface NuclearCursorProps {
    state: 'ready' | 'prepare';
    sx?: SxProps<Theme>;
}

export default function NuclearCursor(props:NuclearCursorProps) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const fn = (ev:MouseEvent) => {
            if (ref.current) {
                ref.current.style.left = `${ev.pageX - 27.5}px`;
                ref.current.style.top = `${ev.pageY - 21.5}px`;
            }
        }
        document.addEventListener("mousemove", fn);
        return () => {
            document.removeEventListener("mousemove", fn)
        }
    }, [ref.current])
    
    return (
        <Box ref={ref} className={props.state === 'ready' ? 'nuclear-cursor' : 'normal-cursor'} sx={props.sx}></Box>
    )
}