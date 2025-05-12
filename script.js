const loginForm = document.querySelector(".login-form");
const registerForm= document.querySelector(".register-form");
const wrapper= document.querySelector(".wrapper");
const loginTitle= document.querySelector(".title-login");
const registerTitle= document.querySelector(".title-register");
const signUpBtn= document.querySelector("#SignUpBtn");
const signInBtn= document.querySelector("#SignInBtn");




const loginLink= document.querySelector(".login-form");
const registerLink= document.querySelector(".register-form");
const loginPopup= document.querySelector(".login");





function loginFuction(){
    loginForm.style.left ="50%";
    loginForm.style.opacity =1;
    registerForm.style.left="150%";
    registerForm.style.opacity=-5;
    wrapper.style.height="500px";
    loginTitle.style.top="100%";
    loginTitle.style.opacity=1;
    registerTitle.style.top="50%";
    registerTitle.style.opacity=0;
}

function registerFuction(){
    loginForm.style.left ="-50%";
    loginForm.style.opacity =0;
    registerForm.style.left="50%";
    registerForm.style.opacity=1;
    wrapper.style.height="580px";
    loginTitle.style.top="-60px";
    loginTitle.style.opacity=-3;
    registerTitle.style.top="50%";
    registerTitle.style.opacity=1;
}
function myFunction() {
    var x = document.getElementById("wrapper");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }



registerLink.addEventListener('click',()=> {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click',()=> {
    wrapper.classList.remove('active');
});
loginPopup.addEventListener('click',()=> {
    wrapper.classList.add('active-popup');
});


