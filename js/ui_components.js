//*******************************
//  CLASS: Joystick2D
//
//  joystick UI element; SVG/Javascript
//  Author: Nick Braun, 2011


function Joystick2D(canvas,handle_id,updateFunc){
//  equation of motion vars for spring action

      var x0,y0;          // base position
      var x,y;            // dynamic position      
      var dX=0
      var dY=0;         // displacement vector
      var velx=0;
      var vely=0;         // velocity 
      var mass=1.0;       // mass 
      var k =1;           // spring constant 
      var damp=0.7;       // damping 
      var s;              // bounding box dimension (hard wall constraint)
      var grabX,grabY ;   // initial grab mousedown coords
  
      var frameInterval=20;   // animation framerate period

      var isReleasing=false;  
      var isGripped=false;

      var handle;    // the SVG element

                  
       handle = canvas.getElementById(handle_id);
       handle.onmousedown=function(evt){grip(evt)}
           
       
       x=parseFloat(handle.getAttribute('cx'));   // set dimensions 
       y=parseFloat(handle.getAttribute('cy'));
       s=1.5*parseFloat(handle.getAttribute('r'));
     
       y0=y;
       x0=x;
       
    //  canvas.documentElement.appendChild(handle);   
      
    
     function gripLoop(){       // transmitting handle state
         if (!isGripped) return
         updateFunc(dX,dY)
         setTimeout(gripLoop, frameInterval); 

        }

      function releaseLoop(){      // animation loop
        if (!isReleasing) return;
       
        // iterate the equation of motion 

        vely = damp * (vely - k* (y-y0)/mass);  y+= vely;
        velx = damp * (velx - k* (x-x0)/mass);  x+= velx;

        updateCanvas();

        // when released handle's kinetic energy has dissipated, stop animating

        if (velx*velx+vely*vely<1e-2) isReleasing=false;  

        setTimeout(releaseLoop, frameInterval);

       }


      function updateCanvas(){  // update handle's drawing position with current x,y

        handle.setAttributeNS(null, 'cx', ''+x);
        handle.setAttributeNS(null, 'cy', ''+y);          
       }


      var grip= function(evt){   // joystick gripped
       
        isGripped=true;
        isLooping=false;
        grabX=evt.clientX;
        grabY=evt.clientY;

 	gripLoop()

      }
 

      this.drag=function(evt){    // joystick dragged
      
        if (!isGripped) return;

         dX=(evt.clientX-grabX);
         dY=(evt.clientY-grabY);
   
       // observe bounding box constraint


         x=  (x=x0+dX)< x0-s ? x0-s: x > x0 +s ? x0+s :x
         y=  (y=y0+dY)< y0-s ? y0-s: y > y0 +s ? y0+s :y


      //   x=Math.min(Math.max(x0+dX,x0-s),x0+s);        
      //   y=Math.min(Math.max(y0+dY,y0-s),y0+s);       
      
         updateCanvas();          
      
      };


      this.released=function()  // joystick released
      {
         isGripped=false;
         isReleasing=true;
         dX=0; dY=0;  
         releaseLoop(); 
      };

}
//*************
//  CLASS: HWHEEL 

// horizontal wheel UI element
// Author: Nick Braun

//  NB wheel drag dx triggers updateFunc(dx);

 function HWheel(canvas,id,updateFunc){

   
      var spokes = [];
      var nspokes=40;               // number of spokes
      var xpos,ypos,height,radius;  // wheel dimensions
         
      var isGripped=false;
 
      var grabX;   // mousedown coordinate
       
      var angle=0;  

      var T_PI=2*Math.PI;
     
      var svgns = "http://www.w3.org/2000/svg";
           

     // get dimensions from canvas.svg file

         var wheelFrame= canvas.getElementById(id)

         radius=0.5*parseFloat(wheelFrame.getAttribute('width'));   
         xpos=parseFloat(wheelFrame.getAttribute('x'))+radius;
         ypos=parseFloat(wheelFrame.getAttribute('y'));
         height=parseFloat(wheelFrame.getAttribute('height'));

     //  create spokes

        var spoke_angle,h,i;

          for(  i = 0; i <= nspokes-1; i++ ) {
        
              spoke_angle= angle+ i*T_PI/nspokes;
         
              h=radius*Math.sin(spoke_angle);    // projected spoke displacement
    
              spokes[i]=canvas.createElementNS(svgns,"rect");
              spokes[i].setAttribute("height",height);
              spokes[i].setAttribute("width",2);
              spokes[i].setAttribute("x",xpos+h);
              spokes[i].setAttribute("y",ypos);

              spokes[i].setAttributeNS(null, "fill", "#336");

                // stop spoke interfering with mousedown 
              spokes[i].setAttributeNS(null, "pointer-events", "none"); 

             canvas.documentElement.appendChild(spokes[i]);

          // only the front projection of the dial should be visible
         
             if (Math.cos(spoke_angle)<0) 
                  spokes[i].setAttributeNS(null, "display", "none");
      }


      
      function update(){

         if (angle>T_PI) angle-=T_PI;
         if (angle<0) angle+=T_PI;
      
         for(  i = 0; i <= nspokes-1; i++ ) {
        
             spoke_angle= angle+ i*T_PI/nspokes;
              h=radius*Math.sin(spoke_angle); 
    
             spokes[i].setAttribute("x",xpos+h);
            
             if (Math.cos(spoke_angle)<0) spokes[i].setAttributeNS(null, "display", "none");
                else spokes[i].setAttributeNS(null, "display", "inline");
          }
    }


      this.grip= function (evt) {  


            isGripped=true;
            grabX=evt.clientX;
         
      }


      this.drag = function (evt){

        if (!isGripped) return;

      
         dx=evt.clientX-grabX;   // handle to center vector
         angle+=dx*1e-2;
         grabX=evt.clientX;         

        updateFunc(dx)


         update();          

      };


      this.released = function(){
         isGripped=false;
      }



}

//*************
//  CLASS: VWHEEL 

// vertical wheel UI element
// Author: Nick Braun

 function VWheel(canvas,id,updateFunc){
    
   
      var spokes = [];
      var nspokes=40;               // number of spokes
      var xpos,ypos,height,radius;  // wheel dimensions
         
      var isGripped=false;
      var grabY;   // mousedown coordinate
      var angle=0;  

      var T_PI=2*Math.PI;
      var svgns = "http://www.w3.org/2000/svg";

 // constructor

     // get dimensions from canvas.svg file

         var wheelFrame= canvas.getElementById(id)

         radius=0.5*parseFloat(wheelFrame.getAttribute('height'));   
         xpos=parseFloat(wheelFrame.getAttribute('x'));
         ypos=parseFloat(wheelFrame.getAttribute('y'))+radius;
         height=parseFloat(wheelFrame.getAttribute('width'));

     //  create spokes

        var spoke_angle,h,i;

          for(  i = 0; i <= nspokes-1; i++ ) {
        
              spoke_angle= angle+ i*T_PI/nspokes;
         
              h=radius*Math.sin(spoke_angle);    // projected spoke displacement
    
              spokes[i]=canvas.createElementNS(svgns,"rect");
              spokes[i].setAttribute("height",2);
              spokes[i].setAttribute("width",height);
              spokes[i].setAttribute("x",xpos);
              spokes[i].setAttribute("y",ypos+h);

              spokes[i].setAttributeNS(null, "fill", "#224");

           // stop spoke interfering with mousedown 
              spokes[i].setAttributeNS(null, "pointer-events", "none"); 

             canvas.documentElement.appendChild(spokes[i]);

          // only the front projection of the dial should be visible
         
             if (Math.cos(spoke_angle)<0) 
                  spokes[i].setAttributeNS(null, "display", "none");
      }


      
      function update(){

         if (angle>T_PI) angle-=T_PI;
         if (angle<0) angle+=T_PI;
      
         for(  i = 0; i <= nspokes-1; i++ ) {
        
             spoke_angle= angle+ i*T_PI/nspokes;
              h=radius*Math.sin(spoke_angle); 
    
             spokes[i].setAttribute("y",ypos+h);
            
             if (Math.cos(spoke_angle)<0) spokes[i].setAttributeNS(null, "display", "none");
                else spokes[i].setAttributeNS(null, "display", "inline");
          }
    }


      this.grip= function (evt) {  


            isGripped=true;
            grabY=evt.clientY;
         
      }


      this.drag = function (evt){

        if (!isGripped) return;

      
         dy=evt.clientY-grabY;   // handle to center vector
         angle+=dy*1e-2;
         grabY=evt.clientY;         

         updateFunc(-dy);
         update();          

      };


      this.released = function(){
         isGripped=false;
      }

}


//*******************************
//  CLASS: Joystick1D
//
//  horizontal joystick UI element; SVG/Javascript
//  Author: Nick Braun, 2011


function Joystick1D(canvas,handle_id,updateFunc){


  //  equation of motion vars for spring action

      var x0;          // base position
      var x;            // dynamic position      
      var dX;         // displacement vector
      var velx=0;
      var mass=1.0;       // mass 
      var k =1;           // spring constant 
      var damp=0.7;       // damping 


      var s;              // bounding box dimension (hard wall constraint)
      var grabX ;   // initial grab mousedown coords

      var frameInterval=20;   // animation framerate period

      var isReleasing=false;  
      var isGripped=false;

      var handle;    // the SVG element

            
       handle = canvas.getElementById(handle_id);
       handle.onmousedown=function(evt){grip(evt)}
  
       
       x=parseFloat(handle.getAttribute('x'));   // set dimensions 
       s=parseFloat(handle.getAttribute('width'));
     
       x0=x;
        
        canvas.documentElement.appendChild(handle);   
      
      
     function gripLoop(){       // transmitting handle state
         if (!isGripped) return
         updateFunc(x-x0)
         setTimeout(gripLoop, frameInterval); 

        }


    function releaseLoop(){      //  mechanical animation
      
        if (!isReleasing) return;
       
        // iterate the equation of motion 

        velx = damp * (velx - k* (x-x0)/mass);  x+= velx;

        updateCanvas();

        // when released handle's kinetic energy has dissipated, stop animating

        if (velx*velx<1e-2) isReleasing=false;  

        setTimeout(releaseLoop, frameInterval);

       }


      function updateCanvas(){  // update handle's drawing position with current x,y

        handle.setAttributeNS(null, 'x', ''+x);
              
       }


      var grip = function(evt){   
       
      
        isGripped=true;
        isReleasing=false;
        grabX=evt.clientX;
       
        gripLoop()
       

      }


      this.drag = function(evt){   
      
        if (!isGripped) return;

         dX=(evt.clientX-grabX);
       
       // observe bounding box constraint
         
         x=  (x=x0+dX)< x0-s ? x0-s: x > x0 +s ? x0+s :x

         updateCanvas();     
      };


      this.released = function()  
      {
         if (!isGripped) return

         isGripped=false;
         isReleasing=true;
         dX=0;  
         releaseLoop(); 
      };

}
 



     

    
