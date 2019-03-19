$(document).ready(function() {
  console.log("Working as intended!");
  $(".input-tweet").keyup(function() {
    let charRemaining = 140 - this.value.length;
  });
});