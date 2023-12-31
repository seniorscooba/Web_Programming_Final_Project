(function ($) {
  // Let's start writing AJAX calls!
  let postElements = document.getElementsByClassName("post");
  let postUpvotes = $('#post-upvotes');
  postUpvotes.hide();

  //Let's get references to our form elements and the div where the todo's will go
  let postsList = $('#post-list');
  if(postsList)
  {
    for(elementIndex in postElements){
    let element = postElements[elementIndex];
    // get post upvotees for element
    bindEventsToPostsCheckbox(element);

     // setup frequency breakdown button listener
     let freqBtn = document.getElementById(`word-breakdown-btn:${element.id}`);
      if(freqBtn)
       freqBtn.addEventListener("click", wordBreakdownFunction);
    }
  }

  function wordBreakdownFunction() {
    // get content
    let postContentId = this.id.split(':')[1];
    let postContentEle = document.getElementById(`post-content:${postContentId}`);
    let postContent = postContentEle.textContent;

    // perform breakdown
    // split all words on white space
    let words = postContent.split(' ');
    let wordCountMap = {};
    for(wordIndex in words){
        let word = words[wordIndex];
        if(wordCountMap[word])
            wordCountMap[word]++;
        else
            wordCountMap[word] = 1; 
    }

    // build string for alert
    let wordStr = 'WORD FREQUENCY BREAKDOWN\n' ;
    wordStr = wordStr + '----------------------------------------\n' ;
    for(wordKey in wordCountMap){
      wordStr = wordStr + `${wordKey} : ${wordCountMap[wordKey]}\n`;
    }
    alert(wordStr);
    return wordCountMap;
  }

  function bindEventsToPostsCheckbox(div) {
    if(div.id){
      let post = $(`input[name=upvoteInput${div.id}]`);
      post.id = div.id;
      post.change(function() {
        if ($(this).is(':checked')) {
          console.log("Checkbox is checked..")
          let requestConfig = {
            method: 'POST',
            url: `${post.context.URL}/${post.id}`,
            isChecked: true,
            data: `checked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {

          });
          requestConfig = {
            method: 'GET',
            url: `${post.context.URL}`,
            data: `checked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {

          });
          
        } else {
          console.log("Checkbox is not checked..")
          
          let requestConfig = {
            method: 'POST',
            url: `${post.context.URL}/${post.id}`,
            data: `notChecked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {

          });
          requestConfig = {
            method: 'GET',
            url: `${post.context.URL}`,
            data: `notChecked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {

          });
        }
      });
    }
  }

  const eventForm = document.getElementById('event-form');
  if (eventForm) {
    // We can store references to our elements; it's better to
    // store them once rather than re-query the DOM traversal each time
    // that the event runs.

    let requestConfig = {
      method: 'GET',
      url: "/events/all",
    };
    $.ajax(requestConfig).then(function (responseMessage) {
      function autocomplete(arr) {
        let inp = document.getElementById("eventSearchInput")
        var currentFocus;
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
        console.log("test1")
      }
      autocomplete(responseMessage);
    });

  }


  // event checkbox
  let elements = document.getElementsByClassName("event");
  let attendees = $('#attendEvent');
  attendees.hide()

  //Let's get references to our form elements and the div where the todo's will go
  let eventList = $('#event-list');
  for(elementIndex in elements){
    let element = elements[elementIndex];
    // get post upvotees for element
    bindEventsToCheckbox(elements[elementIndex]);
  }

  function bindEventsToCheckbox(div) {
    if (div.id) {
      let event = $(`input[name=attendEvent${div.id}]`);
      event.id = div.id;
      event.change(function() {
        if ($(this).is(':checked')) {
          console.log("Checkbox is checked..")
          let requestConfig = {
            method: 'POST',
            url: `${event.context.URL}/${event.id}`,
            isChecked: true,
            data: `checked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {
            let temp = 0;
          });
          requestConfig = {
            method: 'GET',
            url: `${event.context.URL}`,
            data: `checked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {
            let temp = 0;
          });
          
        } else {
          console.log("Checkbox is not checked..")
          
          let requestConfig = {
            method: 'POST',
            url: `${event.context.URL}/${event.id}`,
            data: `notChecked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {
            let temp = 0;
          });
          requestConfig = {
            method: 'GET',
            url: `${event.context.URL}`,
            data: `notChecked`
          };
          $.ajax(requestConfig).then(function (responseMessage) {
            let temp = 0;
          });
        }
      });
    }
  }   



})(window.jQuery);

// Boilerplate autocomplete code
// from: https://www.w3schools.com/howto/howto_js_autocomplete.asp
