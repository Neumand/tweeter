// Modular AJAX request function.
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

// Creates the article element where the tweets will be populated.
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

// Clears all tweets, then loops through the tweet database and prepends them to the DOM.
const renderTweets = populateTweets => {
  $("#tweets-container").empty();
  for (const tweet of populateTweets) {
    let renderedTweet = createTweetElement(tweet);
    renderedTweet.prependTo("#tweets-container");
  }
};

// Ensures tweet length is no more than 140 chars and contains content.
const tweetValidation = () => {
  let check = $(".input-tweet").val();
  if (check.length === 0) {
    $("#tweet-error")
      .text("Please enter content")
      .show();
  } else if (check.length > 140) {
    $("#tweet-error")
      .text("Error: tweet content over 140 characters.")
      .show();
  } else {
    $("#tweet-error").hide();
  }
};

// Below is called only after the DOM is populated.
$(document).ready(function() {
  // AJAX request to render tweets, then load tweets. Compose tweet is hidden.
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
  $(".new-tweet").hide();

  // Event for handling POST request on form submission.
  // After this, tweets are reloaded with the form and counter being reset.
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

  // Event for toggling the compose tweet box on click.
  $(".js-toggle").on("click", function() {
    $(".new-tweet").slideToggle();
    $("textarea").focus();
  });
});
