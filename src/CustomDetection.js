import React, { useRef, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRectCustomModel } from "./utilities";

function CustomDetection({onLoad, onFinishLoad}) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
    const runCoco = useCallback(async () => {
        onLoad('Loading model, please wait...')

        console.log('Loading model')
		const net = await tf.loadGraphModel('https://ories.goes2nobel.com/tf-model/static/model1/model.json')
		console.log(net)
		console.log("Handpose model loaded.");

        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    }, []);


    const detect = async (net) => {
        try {
            // Check data is available
            if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
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
    
                // Reshape image data
                const img = tf.browser.fromPixels(video)
                const resized = tf.image.resizeBilinear(img, [640,480]).cast('int32')
                
                // Execute prediction
                const obj = await net.executeAsync(resized.expandDims(0))
                onFinishLoad('')
    
                // console.log(await obj[2].array())			// 2 score, 3 box, 5 class
                
                // box length array 4 value (0-1)
                // class value (1,2)
                // score length array 100 value (0-1)
    
                // Extract boxes, classes and scores
                const boxes = await obj[3].array()  
                const classes = await obj[5].array()
                const scores = await obj[2].array()
                
                // Cleanup 
                img.dispose()
                resized.dispose()
    
                // Draw mesh
                const ctx = canvasRef?.current?.getContext("2d");
                drawRectCustomModel(boxes[0], classes[0], scores[0], 0.75, videoWidth, videoHeight, ctx); 
            }
        } catch (error) {
            console.log(error)
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

export default CustomDetection;