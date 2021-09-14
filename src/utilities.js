const labelMap = {
    1: {
        name:'Car', color:'lime'
    },
    2: {
        name:'Handphone', color:'yellow'
    }
}

// Main drawing function
export const drawRectCustomModel = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) =>{

	// Loop through each prediction
	for(let i=0; i <= boxes.length; i++){
		// Check if prediction is valid
		if(boxes[i] && classes[i] && scores[i]>threshold){
		
			// Exrtract boxes and classes
			const [y, x, height, width] = boxes[i]; 
			const text = classes[i];

			console.log(width, height, labelMap[text]['name'] + ' ' + Math.round(scores[i]*100) + '%')
			
			// Setup canvas styles
			// const color = Math.floor(Math.random()*16777215).toString(16);
			ctx.beginPath();
			ctx.strokeStyle = labelMap[text]['color']
			ctx.font = '20px Arial';
			ctx.fillStyle = labelMap[text]['color']
			ctx.lineWidth = 5

			// Draw text and rectangle 
			ctx.fillText(labelMap[text]['name'] + ' ' + Math.round(scores[i]*100) + '%', x*imgWidth, y*imgHeight-5);
			ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgWidth/2);    
			ctx.stroke();  
		}
	}
}



export const drawRectCOCOModel = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
  
        // Extract boxes and classes
        const [x, y, width, height] = prediction['bbox']; 
        const text = prediction['class']; 
    
        // ctx.scale(-1, 1);
        // Set styling
        const color = Math.floor(Math.random()*16777215).toString(16);
        ctx.strokeStyle = '#' + color
        ctx.font = '20px Arial';
    
        // Draw rectangles and text
        ctx.beginPath();   
        ctx.fillStyle = '#' + color
        ctx.fillText(text + ' ' + Math.round(prediction['score']*100) + '%', x, y-10);
        ctx.lineWidth = 5
        ctx.rect(x, y, width, height); 
        ctx.stroke();
    });
} 