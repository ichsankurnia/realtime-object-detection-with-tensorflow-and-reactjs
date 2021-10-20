import React, { useRef, useEffect, useCallback } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import {  drawRectCOCOModel } from "./utilities";

function CocoDetection({onLoad, onFinishLoad}) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Main function
    const runCoco = useCallback(async () => {
        onLoad('Loading model, please wait...')

        console.log('Loading model')
        const net = await cocossd.load();
        console.log(net)
        console.log("Handpose model loaded.");

        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    }, []);

    const detect = async (net) => {
        // Check data is available
        if ( typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4 ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Make Detections
        const obj = await net.detect(video);
        console.log(obj)
        onFinishLoad('Finish load model, reload the page if no one detected or lag!')

        // Draw mesh
        const ctx = canvasRef?.current?.getContext("2d");
            drawRectCOCOModel(obj, ctx); 
        }
    };

    useEffect(()=>{
        runCoco()
    },[runCoco]);

    return (
        <div style={{position: 'relative', width: '100%', minHeight: '100vh'}}>
            <Webcam ref={webcamRef} muted={true} /* mirrored={true} */
                style={{ position: 'absolute', marginLeft: "auto", marginRight: "auto", textAlign: "center", left: 0, right: 0, top: '10%', zindex: 9, width: 640, height: 480}}
            />
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', marginLeft: "auto", marginRight: "auto", textAlign: "center", left: 0, right: 0, top: '10%', zindex: 8, width: 640, height: 480}}
            />
        </div>
    );
}

export default CocoDetection;
