import { Box, SxProps, Theme } from "@mui/material";
import './NuclearBoom.css';

export interface NuclearBoomProps {
    sx?: SxProps<Theme>;
}

export default function NuclearBoom(props:NuclearBoomProps) {
    return (
        <Box className='nuclear-mashroom' sx={props.sx}>
            <Box className='nuclear-fireball'>

            </Box>
        </Box>
    )
}