import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, SxProps, Theme } from "@mui/material";
import { fireball, heavyBlast, nuclearRadiation, thermalRadiation } from "../libs/Nuke";

export interface ControlPanelProps {
    state: 'ready' | 'prepare';
    tnt?: number;
    nukes?: {name:string, tnt:number}[];
    sx?: SxProps<Theme>;
    onSetTnt?: (tnt:number)=>void;
    onReady?: ()=>void;
    onCancel?: ()=>void;
}

export default function ControlPanel(props:ControlPanelProps) {
    return (
        <Box sx={props.sx}>
            <Paper elevation={12} sx={{height:'100%', width:360, display:'flex', flexDirection:'column'}}>
            <Stack sx={{p:1}} spacing={1}>
                <FormControl variant="standard">
                    <InputLabel>Nuclear Missle</InputLabel>
                    <Select disabled={props.state === 'ready'} value={props.tnt} onChange={(ev)=>props.onSetTnt?.(ev.target.value as number)}>
                        {
                            props.nukes?.map((item, index) => {
                                return <MenuItem key={index} value={item.tnt}>{item.name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <Button variant="contained" color="error" onClick={()=>props.state === 'ready' ? props.onCancel?.() : props.onReady?.()}>{props.state === 'ready' ? '取消' : '准备'}</Button>
                <Alert severity="error">
                    <AlertTitle>中心火球半径（{fireball(props?.tnt).toFixed(2)}km）</AlertTitle>
                    所有物质都将被有效气化。
                </Alert>
                <Alert severity="error" color="warning">  
                    <AlertTitle>重度爆炸伤害半径（{heavyBlast(props?.tnt).toFixed(2)}km）</AlertTitle>
                    重型混凝土建筑也能被有效摧毁，死亡率接近 100%。
                </Alert>
                <Alert severity="error" color="success">
                    
                <AlertTitle>电离辐射半径（{nuclearRadiation(props?.tnt).toFixed(2)}km）</AlertTitle>
                    致命剂量的电离辐射，可能持续一个月。
                </Alert>
                <Alert severity="error" color="info">
                   <AlertTitle>热辐射半径（{thermalRadiation(props?.tnt).toFixed(2)}km）</AlertTitle>
                   三度以上烧伤，可导致伤残。
                </Alert>
            </Stack>
                <Box sx={{flexGrow:1}}/>
                <Alert severity="success">
                    没有买卖，就没有杀害。
                </Alert>
            </Paper>
        </Box>
    )
}