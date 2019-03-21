const request = (options, callback) => {
  $.ajax(options)
    .done(response => {
      callback(response);
    })
    .fail(err => {
      console.log(`Error: ${err}`);
    })
    .always(() => {
      console.log("Request completed!");
    });
};

const createTweetElement = tweetData => {
  const $newTweet = $("<article>").addClass("flexbox");

  const $header = $("<header>");
  const $imgUser = $("<div>").addClass("img-user");
  $("<img>")
    .attr("src", tweetData.user.avatars.small)
    .attr("alt", "Avatar")
    .appendTo($imgUser);
  $("<h2>")
    .addClass("user")
    .text(tweetData.user.name)
    .appendTo($imgUser);
  $imgUser.appendTo($header);
  $("<h3>")
    .addClass("username")
    .text(tweetData.user.handle)
    .appendTo($header);

  const $tweetContent = $("<p>")
    .addClass("tweet-content")
    .text(tweetData.content.text);

  const $footer = $("<footer>");
  const $dateCreated = $("<div>").addClass("date-created");
  $("<p>")
    .text(tweetData["created_at"])
    .appendTo($dateCreated);
  $dateCreated.appendTo($footer);
  $("<div>")
    .addClass("footer-icons")
    .appendTo($footer);

  $header.appendTo($newTweet);
  $tweetContent.appendTo($newTweet);
  $footer.appendTo($newTweet);

  return $newTweet;
};

// Loop through the tweet database and add them to the DOM.
const renderTweets = populateTweets => {
  $('#tweets-container').empty();
  for (const tweet of populateTweets) {
    let renderedTweet = createTweetElement(tweet);
    renderedTweet.prependTo("#tweets-container");
  }
};

// Verifies if the tweet length is more than 140 chars or there is no content.
const tweetValidation = () => {
  let check = $(".input-tweet").val();
  if (check.length === 0) {
    $("#tweet-error")
      .text("Please enter content")
      .show();
    return false;
  } else if (check.length > 140) {
    $("#tweet-error")
      .text("Error: tweet content over 140 characters.")
      .show();
    return false;
  } else {
    $("#tweet-error").hide();
    return true;
  }
};

$(document).ready(function() {
  const loadTweets = () => {
    request(
      {
        method: "GET",
        url: "/tweets/"
      },
      function(response) {
        renderTweets(response);
      }
    );
  };
  loadTweets();
  $('.new-tweet').hide();

  $("form").on("submit", function(event) {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      url: "/tweets/",
      data: $(this).serialize()
    };
    if (tweetValidation()) {
      request(requestOptions, function(response) {
        renderTweets(response);
      });
      loadTweets();
      $("form").trigger("reset");
      $("#tweet-counter").text(140);
    }
  });

  $(".js-toggle").on("click", function() {
    $(".new-tweet").slideToggle();
    $("textarea").focus();
  });
});
