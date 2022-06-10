for(var i =0;i<document.querySelectorAll(".drum").length;i++) // all the elements of CSS class(.) selector i.e., drum  
{
  document.querySelectorAll(".drum")[i].addEventListener("click", function(){  // add click event listener to (.drum class)
      makeSound(this.innerHTML);
      addAnimation(this.innerHTML)
  })
}
document.addEventListener("keydown",function(event){ // add key press event listener
  makeSound(event.key);
  addAnimation(event.key)
})
function makeSound(key){ // to play appropiate sound
  switch (key) {
    case "w":  var tom1 = new Audio('sounds/tom-1.mp3');
               tom1.play();
               break;
    case "a":   var tom2 = new Audio('sounds/tom-2.mp3');
               tom2.play();
               break;
    case "s":  var tom3 = new Audio('sounds/tom-3.mp3');
               tom3.play();
               break;
    case "d" :  var tom4 = new Audio('sounds/tom-4.mp3');
               tom4.play();
               break;
    case "j":  var snare = new Audio('sounds/snare.mp3');
               snare.play();
               break;
    case "k":  var crash = new Audio('sounds/crash.mp3');
               crash.play();
               break;
    case "l":  var kick = new Audio('sounds/kick-bass.mp3');
               kick.play();
               break;
    default: console.log(innerHTML);

  }
}
function addAnimation(className){ 
  document.querySelector("."+className).classList.add("pressed"); // add one more class (.pressed)
  setTimeout(function(){ // call the function after specified milisecond
  document.querySelector("."+className).classList.remove("pressed"); // remove (.pressed)
},100)
}
