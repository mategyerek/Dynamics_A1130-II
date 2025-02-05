class LinPlot2D {
    constructor(x,y,w,h){
        /*x,y: top left*/
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.width=1;
        this.notchHeight=4;
        this.labelSize=8;
        this.color="white";
        this.headOffSetX=7;
        this.headOffSetY=7;

        this.xAxisName = "x-axis";
        this.yAxisName = "y-axis";

        this.axisSideBox = Math.max(this.headOffSetY,this.notchHeight);
        this.OffSet = this.axisSideBox+2*this.labelSize+5;
        this.lastNotchOffSet = 10;
        this.drawingArea = [this.x+this.OffSet,this.y+this.h-this.OffSet,
            this.w-this.OffSet-this.lastNotchOffSet,this.h-this.OffSet-this.lastNotchOffSet];

        this.xDefaultSteps = 10;
        this.yDefaultSteps = 5;

        this.startX,this.endX,this.stepX;
        this.startY,this.endY,this.stepY;
        this.resetAxes();

    }

    xAxisSize(startX,endX,stepX=null,) {
        this.startX = startX;
        this.endX = endX;
        this.stepX = stepX;
    }

    yAxisSize(startY,endY,stepY=null) {
        this.startY = startY;
        this.endY = endY;
        this.stepY = stepY;
    }

    resetAxes() {
        this.startX = null;
        this.endX = null;
        this.stepX = null;
        this.startY = null;
        this.endY = null;
        this.stepY = null;
    }

    axisNames(xAxisName,yAxisName){
        this.xAxisName = xAxisName;
        this.yAxisName = yAxisName;
    }

    size(width,notchHeight,labelSize,color,headOffSetX,headOffSetY){
        this.width = width;
        this.notchHeight = notchHeight;
        this.labelSize = labelSize;
        this.color = color;
        this.headOffSetX = headOffSetX;
        this.headOffSetY = headOffSetY;

        this.axisSideBox = Math.max(headOffSetY,notchHeight);
        this.OffSet = this.axisSideBox+2*labelSize+5;
        this.drawingArea = [this.x+this.OffSet,this.y+this.h-this.OffSet,
            this.w-this.OffSet-this.lastNotchOffSet,this.h-this.OffSet-this.lastNotchOffSet];
    }

    drawAxis(x,y,length,horizontal=true){
        push();
        textAlign(CENTER,TOP);
        textSize(this.labelSize);
        fill(this.color);
        stroke(this.color);
        strokeWeight(this.width);
        translate(x,y);

        let nameX = length/2;
        let nameY, notchLabelOffSet;
        let axisName;
        let start, end, step;

        if (!horizontal) {
            notchLabelOffSet=-this.axisSideBox-this.labelSize-5;
            nameY = notchLabelOffSet-this.labelSize-5;
            axisName = this.yAxisName
            start = this.startY
            end = this.endY;
            step = this.stepY;

            rotate(-HALF_PI);

        } else {
            notchLabelOffSet = this.axisSideBox;
            nameY = notchLabelOffSet+this.labelSize;
            axisName=this.xAxisName
            start=this.startX;
            end=this.endX;
            step=this.stepX;
        }
        line(0,0,length,0);

        //labels
        text(axisName,nameX,nameY);

        //arrow at end
        line(length,0,length-this.headOffSetX,this.headOffSetY);
        line(length,0,length-this.headOffSetX,-this.headOffSetY);

        //notches
        let notchNum = Math.floor((end-start)/step)+1;
        let notch, notchX;
        let notchStep = (length-this.lastNotchOffSet)/(notchNum-1);

        line(0,-this.notchHeight/2,0,this.notchHeight/2);
        for (let i = 0;i < notchNum;i++) {
            notchX = i*notchStep;
            notch = (start+i*step).toFixed(2);
            line(notchX,-this.notchHeight/2,notchX,this.notchHeight/2);
            text(notch,notchX,notchLabelOffSet);
        }
        pop();
    }

    drawAxisSystem() {

        this.drawAxis(this.x+this.OffSet,this.y+this.h-this.OffSet,this.w-this.OffSet,true); // x
        this.drawAxis(this.x+this.OffSet,this.y+this.h-this.OffSet,this.h-this.OffSet,false); // y

    }

    plot(dataX,dataY,stepX=null,stepY=null,xStepNumber=this.yDefaultSteps,yStepNumber=this.yDefaultSteps,thickness=1,lineColor="red"){
        /*
        Plots LinPlot2D object.
        */
        if (dataX.length != dataY.length) {
            throw RangeError;
        }
        push();
        stroke(lineColor);
        strokeWeight(thickness);

        let maxX = Math.max(...dataX);
        let minX = Math.min(...dataX);
        let maxY = Math.max(...dataY);
        let minY = Math.min(...dataY);
        
        let scaleX, scaleY;

        if (minX == maxX) {
            scaleX = this.drawingArea[2]/2;
            if (this.startX == null) {
            minX -= 1;
            maxX += 1;
            stepX = (maxX-minX)/2;
            }
        } else {scaleX = this.drawingArea[2]/(maxX-minX);}

        if (minY == maxY) {
            scaleY = this.drawingArea[3]/2;
            if (this.startY == null) {
            minY -= 1;
            maxY += 1;
            stepY = (maxY-minY)/2;
            }
        } else {scaleY = this.drawingArea[3]/(maxY-minY);}

        if (this.startX != null) {
            minX = this.startX;
            maxX = this.endX;
            stepX = this.stepX;
        }
        if (this.startY != null) {
            minY = this.startY;
            maxY = this.endY;
            stepY = this.stepY;
        }
        
        if (stepX == null) {
            stepX = (maxX-minX)/xStepNumber;
        }

        if (stepY == null) {
            stepY = (maxY-minY)/yStepNumber;
        }

        this.xAxisSize(minX,maxX,stepX);
        this.yAxisSize(minY,maxY,stepY);

        this.drawAxisSystem();
    
        for (let i = 0; i < dataX.length-1; i++) {
            let x0 = this.drawingArea[0]+(dataX[i]-minX)*scaleX;
            let y0 = this.drawingArea[1]-(dataY[i]-minY)*scaleY;
            let x1 = this.drawingArea[0]+(dataX[i+1]-minX)*scaleX;
            let y1 = this.drawingArea[1]-(dataY[i+1]-minY)*scaleY;
            line(x0,y0,x1,y1);
        }
        //console.log(scaleX,scaleY);

        this.resetAxes();
        pop();
    }

    
}