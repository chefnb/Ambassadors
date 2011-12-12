

//*************
// CLASS: PICTURECARD
// Author: Nick Braun, 2011
//
// picturecard.js
//


 function PictureCard(canvas,front,back){


  var front = canvas.getElementById(front);
  var back = canvas.getElementById(back);
  
  var w=front.getAttribute('width')
  var h=front.getAttribute('height')

  var zoom=1.0
  var zoomMin=0.5
  var zoomMax=5.0
  var tx0=350.0
  var ty0=230.0
  var txMin=-50
  var txMax=700
  var tyMin=-200
  var tyMax=500
  
  var tx=tx0
  var ty=ty0
 
  var m=[ [1,0,0],[0,1,0] ,[0,0,1]]  // Model-view matrix
     
 var setFaceUp = function(bool){

      if (bool) {front.setAttributeNS(null,'display','inline');
            //   back.setAttributeNS(null,'display','none');
                } else {
                 front.setAttributeNS(null,'display','none');
            //   back.setAttributeNS(null,'display','inline')
                  }
      }

  this.resetMV=function(y){
         m=[ [1,0,0],[0,1,0] ,[0,0,1]]
         zoom=1
         tx=tx0
         ty=ty0
       }


  this.translate=function(dx,dy){

 	 tx=  (tx+=dx)< txMin ? txMin: tx > txMax ? txMax :tx
	 ty=  (ty+=dy)< tyMin ? tyMin: ty > tyMax ? tyMax :ty

	 update()
   }

  this.rotateZ= function(rad){

       var s=Math.sin(rad)
       var c=Math.cos(rad)

       m=[ 
             [c*m[0][0]-s*m[1][0], c*m[0][1]-s*m[1][1], c*m[0][2]-s*m[1][2] ],
             [s*m[0][0] +c*m[1][0], s*m[0][1]+c*m[1][1], s*m[0][2]+c*m[1][2] ],
             [m[2][0],  m[2][1], m[2][2] ]        
            ] 

          update()

       }


   this.rotateX= function(rad){

         var s=Math.sin(rad)
         var c=Math.cos(rad)
      
         m=[ 
             [m[0][0], m[0][1], m[0][2] ],
             [c*m[1][0] -s*m[2][0], c*m[1][1]-s*m[2][1], c*m[1][2]-s*m[2][2] ],
             [s*m[1][0]+c*m[2][0],  s*m[1][1]+c*m[2][1], s*m[1][2] +c*m[2][2] ]        
           ] 

            update()
       }


    this.setZoom = function (zoomFactor){
        zoom=  (zoom*=zoomFactor)< zoomMin ? zoomMin: zoom > zoomMax ? zoomMax :zoom
        update()

    }

   var update = function(){
 
       // face up/down depends on model-view matrix
        if (m[1][2]>0) setFaceUp(false); else setFaceUp(true);
    
       // update 3d orientation
 	front.setAttributeNS(null,"transform","translate("+tx+","+ty+")"+"matrix("+m[0][0]+","+m[2][0]+","+m[0][1]+","+m[2][1]+","+m[0][2]+","+m[2][2]+")"+"scale("+zoom+")"+"translate(-"+w/2.0+",-"+h/2.0+")")
   
	back.setAttributeNS(null,"transform","translate("+tx+","+ty+")"+"matrix("+m[0][0]+","+m[2][0]+","+m[0][1]+","+m[2][1]+","+m[0][2]+","+m[2][2]+")"+"scale("+zoom+")"+"translate(-"+w/2.0+",-"+h/2.0+")")

      }

}




  


  
