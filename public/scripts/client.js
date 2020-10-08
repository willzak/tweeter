/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 // Test / driver code (temporary). Eventually will get this from the server.

function timeDiff(curr, prev) { 
  var ms_Min = 60 * 1000; // milliseconds in Minute 
  var ms_Hour = ms_Min * 60; // milliseconds in Hour 
  var ms_Day = ms_Hour * 24; // milliseconds in day 
  var ms_Mon = ms_Day * 30; // milliseconds in Month 
  var ms_Yr = ms_Day * 365; // milliseconds in Year 
  var diff = curr - prev; //difference between dates. 
  // If the diff is less then milliseconds in a minute 
  if (diff < ms_Min) { 
      return Math.round(diff / 1000) + ' seconds ago'; 

      // If the diff is less then milliseconds in a Hour 
  } else if (diff < ms_Hour) { 
      return Math.round(diff / ms_Min) + ' minutes ago'; 

      // If the diff is less then milliseconds in a day 
  } else if (diff < ms_Day) { 
      return Math.round(diff / ms_Hour) + ' hours ago'; 

      // If the diff is less then milliseconds in a Month 
  } else if (diff < ms_Mon) { 
      return 'Around ' + Math.round(diff / ms_Day) + ' days ago'; 

      // If the diff is less then milliseconds in a year 
  } else if (diff < ms_Yr) { 
      return 'Around ' + Math.round(diff / ms_Mon) + ' months ago'; 
  } else { 
      return 'Around ' + Math.round(diff / ms_Yr) + ' years ago'; 
    } 
  } 
  
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

const createTweetElement = function(tweetData) {
  const relTime = timeDiff(Date.now(), `${tweetData.created_at}`)
  const safeHTML = escape(tweetData.content.text)
  let $tweet = $(`
  <article>
    <header class='tweetHeader'>
      <div class='tweet'>
        <img class="tweetProfilePic" src="${tweetData.user.avatars}">
        <p>${tweetData.user.name}</p>
      </div>
      <div class="handle">
        <p>${tweetData.user.handle}</p>
      </div>
    </header>

    <div class="tweet">
    <p>${safeHTML}</p>
    </div>

    <footer class="tweetFooter">
      <div class='tweet'>
        <p>${relTime}</p>
      </div>
      <div class='tweet'>
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
  </article>`)

  return $tweet;
};

const renderTweets = function(data) {
  //organize by date added
  data.sort(function(x, y){
    return y.created_at - x.created_at;
  });

  for (let tweet of data) {
    let output = createTweetElement(tweet);
    $('#tweets-container').append(output);
  }
};

$(document).ready(function () {

  const loadTweets = function() {
      $(function() {
      $.ajax('http://localhost:8080/tweets', { method: 'GET' })
      .then(function (tweets) {
        $("#tweets-container").empty();
        $("#error").html("");
        renderTweets(tweets);
      })
    })
  }

  loadTweets();
  
  $(".new-tweet").on('submit', function(event) {
    event.preventDefault();
    
    const tweetText = $("#tweet-text").serialize()
    const tweetTextRaw = $("#tweet-text").val();

    //send tweet to DB
    if (tweetTextRaw === "" || tweetTextRaw === null) {
      $("#error").html("🚨 Please provide an input for your tweet 🚨");
      $("#error").slideDown("slow");
    } else if (tweetTextRaw.length > 140) {
      $("#error").html("🚨 Please make sure tweet is less than 140 characters in length 🚨");
      $("#error").slideDown("slow");
    } else {
      $.post("http://localhost:8080/tweets", tweetText, function() {
        $("#error").slideUp("slow")
        loadTweets();
        $("#tweet-text").val("");
      });
    }

  })
});