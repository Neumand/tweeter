$(document).ready(function() {
  console.log("Working as intended!");
  $(".input-tweet").keyup(function() {
    let charRemaining = 140 - this.value.length;
    let counter = $(this).siblings().find('.counter').text(charRemaining);
    if (charRemaining < 0) {
      $("#tweet-counter").css('color', 'red');
    } else {
      $('#tweet-counter').css('color', '#244751');
    }
  });
});