const image_input = document.querySelector('#image-input');
var uploaded_img = "";

image_input.addEventListener("change", function() {
  const reader = new FileReader();
    reader.addEventListener("load", () => {
    uploaded_img = reader.result;
    document.querySelector("#event-img").style.backgroundImage = `url(${uploaded_img})`;
  });
  reader.readAsDataURL(this.files[0]);
})