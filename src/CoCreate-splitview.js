
var splitterHorizontalArray = document.getElementsByClassName("svSplitter svHorizontal");
var splitterVerticalArray = document.getElementsByClassName("svSplitter svVertical");

for (let i = 0; i < splitterHorizontalArray.length; i++) {
    splitterHorizontalArray[i].addEventListener('mousedown', initDragHorizontal, false);
    splitterHorizontalArray[i].addEventListener('touchstart', initDragHorizontal, false);
}
for (let i = 0; i < splitterVerticalArray.length; i++) {
    splitterVerticalArray[i].addEventListener('mousedown', initDragVertical, false);
    splitterVerticalArray[i].addEventListener('touchstart', initDragVertical, false);
}

var thisSplitter, myFamily, myPosition, myAboveDiv, myBelowDiv, 
    myLeftDiv, myRightDiv, startMouseX,startTouchX, startMouseY,
    startTouchY, startHeightAbove, startHeightBelow, startWidthLeft, 
    startWidthRight,startWindowWidth,beforeScreenResizeWidthLeft,
    beforeScreenResizeWidthRight,totalWidth,totalHeight,totalDiv,
    svColumnDivArr,svColumnDivWidthArray,
    svPanelDivArr, svPanelDivHeightArr,
    containerDiv,containerDivWidth, containerDivHeight,
    minMoveLimit, maxMoveLimit,
    mySplitterFamily,mySplitterPosition,restSplitterBelowHeight,restSplitterAboveHeight,restSplitterRightWidth,restSplitterleftWidth;
    
//////////////////////////////// Horizontal Resizing ////////////////////////
function initDragHorizontal(e) {
    
    thisSplitter = e.target;
    totalHeight = parseInt(document.defaultView.getComputedStyle(e.path[1]).height, 10);
    /*myFamily: Above, Splitter, Below Divs*/
    myFamily = [];
    for (let i = 0; i < e.path[1].children.length; i++) {
        myFamily.push(e.path[1].children[i]);
    }
    svPanelDivArr = [];
    myFamily.forEach(family => {
        if(family.classList.contains("svPanel"))
            svPanelDivArr.push(family);
    });
    
    svPanelDivHeightArr = [];
    svPanelDivArr.forEach(panel => {
        svPanelDivHeightArr.push(parseInt(document.defaultView.getComputedStyle(panel).height,10));
    });
    /*Dont allow other divs move together*/
    for(let i=0; i<svPanelDivArr.length;i++){
        svPanelDivArr[i].style.minHeight = svPanelDivHeightArr[i]*100/totalHeight + '%';
        svPanelDivArr[i].style.pointerEvents = "none";
    }
    
    e.path.forEach(element => {
        if(element.classList && element.classList.contains("container"))
            containerDiv = element;
    });
    containerDivHeight = parseInt(document.defaultView.getComputedStyle(containerDiv).height,10);
    myPosition = myFamily.indexOf(thisSplitter);
    myAboveDiv = myFamily[myPosition - 1];
    myBelowDiv = myFamily[myPosition + 1];
    
    /*My Splitter Group*/
    mySplitterFamily = []; 
    myFamily.forEach(family => {
        if(family.classList.contains("svSplitter") && family.classList.contains("svHorizontal"))
            mySplitterFamily.push(family);
    });
    mySplitterPosition = mySplitterFamily.indexOf(thisSplitter);
    // restSplitterBelowHeight = parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)*(mySplitterFamily.length-mySplitterPosition)+parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)/2;
    // restSplitterAboveHeight = parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)*(mySplitterPosition)+parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)/2;
    /*Splitter own heights*/
    restSplitterBelowHeight = parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)*(mySplitterFamily.length-mySplitterPosition-1);
    restSplitterAboveHeight = parseInt(document.defaultView.getComputedStyle(thisSplitter).height,10)*(mySplitterPosition);
    
    if (e.type == "mousedown")
        startMouseY = e.clientY;
    if (e.type == "touchstart")
        startTouchY = e.touches[0].clientY;
        
    startHeightAbove = parseInt(document.defaultView.getComputedStyle(myAboveDiv).height, 10);
    startHeightBelow = parseInt(document.defaultView.getComputedStyle(myBelowDiv).height, 10);
    minMoveLimit = startMouseY - startHeightAbove;
    maxMoveLimit = startMouseY + startHeightBelow;
    document.documentElement.addEventListener('mousemove', doDragHorizontal, false);
    document.documentElement.addEventListener('mouseup', stopDragHorizontal, false);
    document.documentElement.addEventListener('touchmove', doDragHorizontal, false);
    document.documentElement.addEventListener('touchend', stopDragHorizontal, false);
}

function doDragHorizontal(e) {
    if (e.type == "mousemove" &&(e.clientY > minMoveLimit) &&(e.clientY < maxMoveLimit) && (e.clientY > restSplitterAboveHeight+15) && (e.clientY < containerDivHeight+15-restSplitterBelowHeight) ) {
        myAboveDiv.style.minHeight = (startHeightAbove + e.clientY - startMouseY)*100/(totalHeight) + '%';
        myBelowDiv.style.minHeight = (startHeightBelow - e.clientY + startMouseY)*100/(totalHeight) + '%';
    }
    if (e.type == "touchmove" &&(e.touches[0].clientY > (startTouchY-startHeightAbove)) &&(e.touches[0].clientY < (startTouchY+startHeightBelow)) && (e.touches[0].clientY > restSplitterAboveHeight+15) && (e.touches[0].clientY < containerDivHeight+15-restSplitterBelowHeight)) {
        
        myAboveDiv.style.minHeight = (startHeightAbove + e.touches[0].clientY - startTouchY)*100/(totalHeight) + '%';
        myBelowDiv.style.minHeight = (startHeightBelow - e.touches[0].clientY + startTouchY)*100/(totalHeight) + '%';
    }
}
function stopDragHorizontal(e) {
    for(let i=0; i<svPanelDivArr.length;i++){
        svPanelDivArr[i].style.pointerEvents = "auto";
    }
    document.documentElement.removeEventListener('mousemove', doDragHorizontal, false);
    document.documentElement.removeEventListener('mouseup', stopDragHorizontal, false);
    document.documentElement.removeEventListener('touchmove', doDragHorizontal, false);
    document.documentElement.removeEventListener('touchend', stopDragHorizontal, false);
}



//////////////////////////////// Vertical Resizing //////////////////////////
function initDragVertical(e) {
    
    thisSplitter = e.target;
    totalDiv = e.path[1];
    totalWidth = parseInt(document.defaultView.getComputedStyle(totalDiv).width, 10);
    myFamily = [];
    for (let i = 0; i < e.path[1].children.length; i++) {
        myFamily.push(e.path[1].children[i]);
    }
    svColumnDivArr = [];
    myFamily.forEach(family => 
        {
            if(family.classList.contains("svColumn")){
                svColumnDivArr.push(family);
            }
        }
    );
    
    svColumnDivWidthArray = [];
    svColumnDivArr.forEach(svColumnDiv => {
        svColumnDivWidthArray.push(parseInt(document.defaultView.getComputedStyle(svColumnDiv).width, 10));
    });
    
    for(let i=0; i<svColumnDivArr.length;i++){
        svColumnDivArr[i].style.minWidth = svColumnDivWidthArray[i]*100/totalWidth + '%';
        svColumnDivArr[i].style.pointerEvents = "none";
    }
    
    e.path.forEach(element =>{
        if(element.classList && element.classList.contains("svColumn"))
            containerDiv = element;
    });
    containerDivWidth = parseInt(document.defaultView.getComputedStyle(containerDiv).width,10);
    myPosition = myFamily.indexOf(thisSplitter);
    myLeftDiv = myFamily[myPosition - 1];
    myRightDiv = myFamily[myPosition + 1];
    
    mySplitterFamily = []; 
    myFamily.forEach(family => {
        if(family.classList.contains("svSplitter") && family.classList.contains("svVertical"))
            mySplitterFamily.push(family);
    });
    mySplitterPosition = mySplitterFamily.indexOf(thisSplitter);
    // restSplitterRightWidth = parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)*(mySplitterFamily.length-mySplitterPosition)+parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)/2;
    // restSplitterleftWidth = parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)*(mySplitterPosition)+parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)/2;
    
    restSplitterRightWidth = parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)*(mySplitterFamily.length-mySplitterPosition-1);
    restSplitterleftWidth = parseInt(document.defaultView.getComputedStyle(thisSplitter).width,10)*(mySplitterPosition);
    
    if (e.type == "mousedown")
        startMouseX = e.clientX;
    if (e.type == "touchstart")
        startTouchX = e.touches[0].clientX;
    
    startWindowWidth = window.innerWidth;
    startWidthLeft = parseInt(document.defaultView.getComputedStyle(myLeftDiv).width, 10);
    startWidthRight = parseInt(document.defaultView.getComputedStyle(myRightDiv).width, 10);
    
    minMoveLimit = startMouseX - startWidthLeft;
    maxMoveLimit = startMouseX + startWidthRight;
    
    document.documentElement.addEventListener('mousemove', doDragVertical, false);
    document.documentElement.addEventListener('mouseup', stopDragVertical, false);
    document.documentElement.addEventListener('touchmove', doDragVertical, false);
    document.documentElement.addEventListener('touchend', stopDragVertical, false);
    window.addEventListener('resize', doDragVertical, false);
}

function doDragVertical(e) {
    if (e.type == "mousemove" && (e.clientX > minMoveLimit) && (e.clientX < maxMoveLimit) && (e.clientX > restSplitterleftWidth+15) && (e.clientX < containerDivWidth+15-restSplitterRightWidth)) {
        myLeftDiv.style.minWidth = (startWidthLeft + e.clientX - startMouseX)*100/(totalWidth) + '%';
        myRightDiv.style.minWidth = (startWidthRight - e.clientX + startMouseX)*100/(totalWidth) + '%';

        beforeScreenResizeWidthLeft = parseInt(startWidthLeft + e.clientX - startMouseX,10);
        beforeScreenResizeWidthRight = parseInt(startWidthRight - e.clientX + startMouseX,10);
    }
    if (e.type == "touchmove" && (e.touches[0].clientX > (startTouchX- startWidthLeft)) && (e.touches[0].clientX < (startTouchX+ startWidthRight)) && (e.touches[0].clientX > restSplitterleftWidth+15) && (e.touches[0].clientX < containerDivWidth+15-restSplitterRightWidth)) {
        myLeftDiv.style.minWidth = (startWidthLeft + e.touches[0].clientX - startTouchX)*100/(totalWidth) + '%';
        myRightDiv.style.minWidth = (startWidthRight - e.touches[0].clientX + startTouchX)*100/(totalWidth) + '%';
        beforeScreenResizeWidthLeft = parseInt(startWidthLeft + e.touches[0].clientX - startTouchX,10);
        beforeScreenResizeWidthRight = parseInt(startWidthRight - e.touches[0].clientX + startTouchX,10);
    }
    if (e.type == "resize") {
        if(window.innerWidth < startWindowWidth)
            myLeftDiv.style.width = (beforeScreenResizeWidthLeft - (startWindowWidth - window.innerWidth))*100/totalWidth + '%';
        if(window.innerWidth > startWindowWidth)
            myLeftDiv.style.width = (beforeScreenResizeWidthRight + (window.innerWidth - startWindowWidth))*100/totalWidth + '%';
    }
    // myLeftDiv.classList.remove("svPanel")
    // myRightDiv.classList.remove("svPanel")

}
function stopDragVertical(e) {
    for(let i=0; i<svColumnDivArr.length;i++){
        svColumnDivArr[i].style.pointerEvents = "auto";
    }
    document.documentElement.removeEventListener('mousemove', doDragVertical, false);
    document.documentElement.removeEventListener('mouseup', stopDragVertical, false);
    document.documentElement.removeEventListener('touchmove', doDragVertical, false);
    document.documentElement.removeEventListener('touchend', stopDragVertical, false);
}

export default {initDragHorizontal, doDragHorizontal, stopDragHorizontal,
initDragVertical, doDragVertical, stopDragVertical}

