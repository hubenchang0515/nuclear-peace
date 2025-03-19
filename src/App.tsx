import { Box } from '@mui/material';
import MapView from './components/MapView';
import Cursor from './components/Cursor';
import { useCallback, useState } from 'react';
import ControlPanel from './components/ControlPanel';

import standby from './assets/audio/standby.mp3';
import cancel from './assets/audio/cancel.mp3';
import snukexpl from './assets/audio/snukexpl.mp3';
import snukread from './assets/audio/snukread.mp3';
import snuksire from './assets/audio/snuksire.mp3';
import warning from './assets/audio/warning.mp3';
import { play } from './libs/Audio';
import './components/NuclearBoom.css';

function App() {
    const nukes = [
        {
            name: '"小男孩（1.5万吨）"',
            tnt: 15000,
        },

        {
            name: '"胖子（2万吨）"',
            tnt: 20000,
        },

        {
            name: '"白杨（80万吨）"',
            tnt: 800000,
        },

        {
            name: '"常春藤麦克"(1040万吨)',
            tnt: 1040000,
        },

        {
            name: '"喝彩城堡（1500万吨）"',
            tnt: 15000000,
        },


        {
            name: '"沙皇（5000万吨）"',
            tnt: 50000000,
        },

        {
            name: '"沙皇（1亿吨）"',
            tnt: 100000000,
        },
    ];

    const [state, setState] = useState<'ready' | 'prepare'>('prepare');
    const [tnt, setTnt] = useState(nukes[0].tnt);
    const [boom, setBoom] = useState<[number, number]>([NaN, NaN]);

    const onReady = useCallback(() => {
        setState('ready');
        play(standby);
        play(snukread);
    }, []);

    const onCancel = useCallback(() => {
        play(cancel);
        setState('prepare');
    }, []);

    const onLaunch = useCallback((pos:[number, number]) => {
        if (state !== 'ready') {
            return;
        }

        play(warning);
        play(snuksire);
        
        setTimeout(() => {
            setBoom(pos);
            setTimeout(() => {
                play(snukexpl);
            }, 1000);
        }, 9000);
    }, [state]);

    return (
        <Box sx={{width:'100%', height:'100%', display:'flex'}}>
            <MapView state={state} url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' sx={{flexGrow:1}} tnt={tnt} boom={boom} onClick={onLaunch}/>
            <ControlPanel state={state} nukes={nukes} tnt={tnt} onSetTnt={setTnt} onReady={onReady} onCancel={onCancel}/>
            <Cursor state={state} sx={{position:'fixed', top:'50%', left:'50%'}}/>
        </Box>
    )
}

export default App
