const pen = document.getElementById("edit");
const name = document.querySelector("#name");
const prof = document.querySelector(".profession");
const name_post = document.querySelector(".name-post");
// const contact_form = document.querySelector(".contact-form")
const contactEditIcon = document.getElementById("edit-contact");
const contactEdits = document.querySelectorAll(".contact-edits");
const basicEditIcon = document.getElementById("edit-basic")
const basicEdits = document.querySelectorAll(".basic-edits")

function hide(x) {
  x.style.display = "none";
}

function show(x) {
  x.style.display = "block";
}

function toggle(x) {
  if (x.style.display == "none") {
    show(x);
  } else {
    hide(x);
  }
}

pen.addEventListener("click", (e) => {
  toggle(name);
  toggle(prof);
  toggle(name_post);
});

contactEditIcon.addEventListener("click", (e) => {
  
  for (i = 0; i < 7; i++) {
    toggle(contactEdits[i]);
    toggle(document.getElementsByClassName("input-contact")[i])

  }

  toggle(document.getElementsByClassName("contact-save")[0])
  // toggle(document.getElementById("save-button-row"))
});

basicEditIcon.addEventListener("click",(e)=>{
 for (i=0;i<2;i++){
   toggle(basicEdits[i])
   toggle(document.getElementsByClassName("input-basic")[i])
 }
 toggle(document.getElementsByClassName("basic-save")[0])
})
