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
})(window.jQuery);
