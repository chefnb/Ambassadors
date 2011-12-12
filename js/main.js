//     
// Anamorphic viewer  - SVG/Javascript
// 
// Author: Nick Braun, 2011
//
// main.js
//



   var zWheel,xWheel,zoomHandle,translateStick  // UI elements

   var theImage= null   
   var maxZoom=5.0
   var minZoom=0.1

   var isOn=true


  function init(){
        
       
        canvas=document.getElementById('svg_canvas').svg

        theImage = new PictureCard(canvas,'cardFront','cardBack')
       
     
       
        zWheel= new HWheel(canvas,'zWheel',function (delta){theImage.rotateZ(delta/60.0)}) 
        xWheel= new VWheel(canvas,'xWheel',function (delta){theImage.rotateX(delta/60.0)}) 


     //  canvas.documentElement.appendChild(canvas.getElementById("casing"));   
      

        zoomHandle = new Joystick1D(canvas,'zoomHandle',function(delta){

                      theImage.setZoom(1+5e-4*delta)
                      })

        translateStick = new Joystick2D(canvas,'translateStick',function(dx,dy){

                      theImage.translate(dx*0.1,dy*0.1)
                      })

  
     
       theImage.rotateX(Math.PI/2.0)
  
       document.getElementById('container').style.visibility = 'visible';
       document.getElementById('loading').style.display = 'none';   
	


}

 
 

//***** Mouse events ****

  function reset(){
     theImage.resetMV()
     theImage.rotateX(Math.PI/2.0)
   }


  function released(){

      zWheel.released()
      xWheel.released()
      zoomHandle.released()
      translateStick.released()
     
     
        
   }
  
  function drag(evt){ 
   
       zWheel.drag(evt)
       xWheel.drag(evt)
       zoomHandle.drag(evt)
       translateStick.drag(evt)
   
  }


