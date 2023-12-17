(function ($) {
  // Let's start writing AJAX calls!
  let elements = document.getElementsByClassName("post");
  let postUpvotes = $('#post-upvotes');
  postUpvotes.hide();

  //let postList = {};
  //let loggedInIdUser = {};
  // let requestConfig = {
  //   method: 'GET',
  //   url: `${document.URL}/json`,
  //   isChecked: true,
  //   data: `checked`
  // };
  // $.ajax(requestConfig).then(function (responseMessage) {
  //   postList = responseMessage[0];
  //   loggedInUser = responseMessage[1];
  // });

  //Let's get references to our form elements and the div where the todo's will go
  let postsList = $('#post-list');
  for(elementIndex in elements){
    let element = elements[elementIndex];
    // get post upvotees for element
    bindEventsToCheckbox(elements[elementIndex]);
  }

  // for(elementIndex in elements){
  //   let element = elements[elementIndex];
  //   let checkbox = element.getElementsByClassName("upvote-checkbox")[0];
  //   for(post in postList){
  //     if(postList[post]._id == element.id){
  //       let foundUpvotee = postList[post].postUpvotes.find(x => x === loggedInUser._id);
  //       if(foundUpvotee){
  //         checkbox.checked = true;
  //       }
  //     }
  //   }
  // }

  const validateField = (field) =>{
    try{
      if(Array.isArray(field)){
        // check for present fields
        if(field.length && field.length > 0)
          return field;
        else
          return "N/A";
      }
      if(field != undefined && field != "")
        return field;
      else
        return "N/A";
    }
    catch(exception) {}
  }

  function bindEventsToCheckbox(div) {
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
    const firstNumberElement = document.getElementById('number1');
    const secondNumberElement = document.getElementById('number2');
    const operationElement = document.getElementById('operation');

    const errorContainer = document.getElementById('error-container');
    const errorTextElement =
      errorContainer.getElementsByClassName('text-goes-here')[0];

    const resultContainer = document.getElementById('result-container');
    const resultTextElement =
      resultContainer.getElementsByClassName('text-goes-here')[0];

    // We can take advantage of functional scoping; our event listener has access to its outer functional scope
    // This means that these variables are accessible in our callback
    staticForm.addEventListener('submit', (event) => {
      event.preventDefault();

      try {
        // hide containers by default
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');

        // Values come from inputs as strings, no matter what :(
        const firstNumberValue = firstNumberElement.value;
        const secondNumberValue = secondNumberElement.value;
        const operationValue = operationElement.value;
        console.log(typeof firstNumberValue);
        const parsedFirstNumberValue = parseInt(firstNumberValue);
        console.log(typeof parsedFirstNumberValue);
        const parsedSecondNumberValue = parseInt(secondNumberValue);
        const operation = operationStringToFunction(operationValue);

        const result = operation(
          parsedFirstNumberValue,
          parsedSecondNumberValue
        );

        resultTextElement.textContent = 'The result is ' + result;
        console.log(`${result}`);
        resultContainer.classList.remove('hidden');
      } catch (e) {
        const message = typeof e === 'string' ? e : e.message;
        errorTextElement.textContent = e;
        errorContainer.classList.remove('hidden');
      }
    });
  }
})(window.jQuery);