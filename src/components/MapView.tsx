import './MapView.css'
import { Box, SxProps, Theme } from "@mui/material";
import { useEffect, useRef } from "react"
import Map from 'ol/Map';
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Circle } from 'ol/geom';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fireball, heavyBlast, nuclearRadiation, thermalRadiation } from '../libs/Nuke';
import Stroke from 'ol/style/Stroke';
import { wrapX } from 'ol/coordinate';

export interface MapProps {
    url: string;
    state: 'ready' | 'prepare';
    tnt: number;
    boom: [number, number];
    sx?: SxProps<Theme>;
    children?: React.ReactNode;
    onClick?:(pos:[number, number])=>void;
}

export default function MapView(props:MapProps) {
    const mapRef = useRef<Map>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);

    // 初始化
    useEffect(() => {
        if (mapDivRef.current === null) {
            return;
        }
        mapRef.current = new Map({
            target: mapDivRef.current,
            layers: [
                new TileLayer({
                    source: new XYZ({  
                        url: props.url,       
                        wrapX: true,
                    }),
                })
            ],
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 4,
            }),
        });

        mapRef.current.getControls().clear();

        return () => {
            mapRef.current?.dispose();
        }
    }, [props.url]);

    // 绑定点击事件
    useEffect(() => {
        const fn = (ev:MapBrowserEvent<any>) => {props.onClick?.([ev.coordinate[0], ev.coordinate[1]])};
        mapRef.current?.on("click", fn);
        return () => {
            mapRef.current?.un("click", fn);
        }
    }, [props.onClick])
    
    // 播放爆炸动画
    useEffect(() => {
        if (isNaN(props.boom[0]) || isNaN(props.boom[1])) {
            return;
        }
        const boom = wrapX(props.boom, mapRef.current?.getView().getProjection()!);
        const fireball = document.createElement('div');
        fireball.className = 'nuclear-fireball';
        const mashroom = document.createElement('div');
        mashroom.className = 'nuclear-mashroom';
        mashroom.appendChild(fireball);

        const overlay = new Overlay({
            element: mashroom,
            positioning: 'center-center',
            position: boom,
        });

        mapRef.current?.addOverlay(overlay);

        // 播放完成后删除div
        setTimeout(() => {
            mapRef.current?.removeOverlay(overlay);
        }, 8000);
    }, [props.boom]);

    // 标记杀伤范围
    useEffect(() => {
        if (isNaN(props.boom[0]) || isNaN(props.boom[1])) {
            return;
        }

        const boom = wrapX(props.boom, mapRef.current?.getView().getProjection()!)

        const thermalRadiationCircle = new Circle(boom, 1000*thermalRadiation(props.tnt));
        const thermalRadiationFeature = new Feature(thermalRadiationCircle);
        thermalRadiationFeature.setStyle(new Style({
            fill: new Fill({color: 'rgba(76,172,224, 0.2)'}),
            stroke: new Stroke({color: 'rgba(76,172,224, 1)'})
        }));

        const nuclearRadiationCircle = new Circle(boom, 1000*nuclearRadiation(props.tnt));
        const nuclearRadiationFeature = new Feature(nuclearRadiationCircle);
        nuclearRadiationFeature.setStyle(new Style({
            fill: new Fill({color: 'rgba(64,137,68, 0.2)'}),
            stroke: new Stroke({color: 'rgba(64,137,68, 1)'})
        }));

        const heavyBlastCircle = new Circle(boom, 1000*heavyBlast(props.tnt));
        const heavyBlastFeature = new Feature(heavyBlastCircle);
        heavyBlastFeature.setStyle(new Style({
            fill: new Fill({color: 'rgba(239,121,24, 0.2)'}),
            stroke: new Stroke({color: 'rgba(239,121,24, 1)'})
        }));
        
        const fireballCircle = new Circle(boom, 1000*fireball(props.tnt));
        const fireballFeature = new Feature(fireballCircle);
        fireballFeature.setStyle(new Style({
            fill: new Fill({color: 'rgba(255, 0, 0, 0.2)'}),
            stroke: new Stroke({color: 'rgba(255, 0, 0, 1)'})
        }));
        
        const layer  = new VectorLayer({
            source: new VectorSource({
                features: [thermalRadiationFeature, nuclearRadiationFeature, heavyBlastFeature, fireballFeature],
            }),
        });

        mapRef.current?.addLayer(layer);
        mapRef.current?.getView().fit(thermalRadiationCircle.getExtent(), {duration: 200});
    }, [props.boom]);

    return (
        <Box ref={mapDivRef} className='map-view' sx={props.sx}>
            {props.children}
        </Box>
    )
}