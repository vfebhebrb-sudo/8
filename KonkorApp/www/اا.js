
const createAccountBtn =
document.getElementById("createAccount");

// ======================================================
// REGISTER FORM
// Version 3.0
// ======================================================

console.log("Register JS Loaded");

console.log(registerForm);

// ======================================================
// CONFIG
// ======================================================

const CONFIG = {

    debounceDelay:700,

    password:{

        minLength:6,

        goodLength:8,

        strongLength:12

    },

    orb:{

        size:10,

        lerp:0.08

    }

};

// ======================================================
// INPUTS
// ======================================================

const fullnameInput =
document.getElementById("fullname");

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const confirmPasswordInput =
document.getElementById("confirmPassword");

// ======================================================
// PASSWORD ELEMENTS
// ======================================================

const passwordGroup =
document.getElementById("passwordGroup");



const passwordToggle =
document.getElementById("togglePassword");

const passwordIcon =
passwordToggle.querySelector("i");

// ======================================================
// STATUS
// ======================================================

function setValid(group){

    group.classList.remove("invalid");

    group.classList.add("valid");

}

function setInvalid(group){

    group.classList.remove("valid");

    group.classList.add("invalid");

}

function clearStatus(group){

    group.classList.remove("valid");

    group.classList.remove("invalid");

}
// ======================================================
// DEBOUNCE
// ======================================================

const debounceTimers = {};

function debounceValidate(
    input,
    callback,
    delay = CONFIG.debounceDelay
){

    clearTimeout(
        debounceTimers[input.id]
    );


    debounceTimers[input.id] = setTimeout(()=>{

        callback();

    }, delay);

}


// ======================================================
// VALIDATION ENGINE
// ======================================================

function validateFullname(){

    const value = fullnameInput.value.trim();


    if(value === ""){

        clearStatus(fullnameInput.parentElement);

        return;

    }


    if(value.length >= 3){

        setValid(fullnameInput.parentElement);

    }
    else{

        setInvalid(fullnameInput.parentElement);

    }

}


// ------------------------------------------------------


function validateEmail(){

    const value = emailInput.value.trim();


    if(value === ""){

        clearStatus(emailInput.parentElement);

        return;

    }


    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if(emailRegex.test(value)){

        setValid(emailInput.parentElement);

    }
    else{

        setInvalid(emailInput.parentElement);

    }

}


// ======================================================
// PASSWORD SCORE
// ======================================================

function getPasswordScore(password){

    let score = 0;


    // Length

    if(password.length >= CONFIG.password.minLength)
        score++;


    if(password.length >= CONFIG.password.goodLength)
        score++;


    if(password.length >= CONFIG.password.strongLength)
        score++;



    // Lowercase

    if(/[a-z]/.test(password))
        score++;



    // Uppercase

    if(/[A-Z]/.test(password))
        score++;



    // Number

    if(/[0-9]/.test(password))
        score++;



    // Special Character

    if(/[!@#$%^&*()_\-+=<>?{}[\]|~]/.test(password))
        score++;



    return Math.min(score,5);

}


// ======================================================
// PASSWORD VALIDATION
// ======================================================

function validatePassword(){

    const value = passwordInput.value;

    if(value.length < 8){

    setInvalid(passwordGroup);

    typePasswordMessage(
        "رمز باید حداقل ۸ کاراکتر باشد",
        "weak"
    );

    return;         
    }

    if(value === ""){

        clearStatus(passwordGroup);

        typingSuccess.textContent = "";

        return;

    }



    const score = getPasswordScore(value);



    if(score <= 1){


        setInvalid(passwordGroup);


        typePasswordMessage(
            "رمز بسیار ضعیف است"
        );


    }


    else if(score === 2){


        setInvalid(passwordGroup);


        typePasswordMessage(
            "رمز ضعیف است",
            "weak"
        );


    }


    else if(score === 3){


        clearStatus(passwordGroup);


            typePasswordMessage(
                "رمز متوسط است",
                "medium"
            );

    }


    else if(score === 4){


        setValid(passwordGroup);


        typePasswordMessage(
            "رمز خوب است",
            "good"
        );

    }


  else{

    setValid(passwordGroup);


    typePasswordMessage(
        "رمز بسیار قوی است ✓",
        "strong"
    );


    clearTimeout(successTimer);


    successTimer = setTimeout(()=>{

        hidePasswordMessage();

    },1200);


    }

}


// ======================================================
// TYPING ANIMATION
// ======================================================
let typingTimer;


function typePasswordMessage(text, type){

    clearTimeout(typingTimer);


    typingSuccess.className =
    "typing-success " + type;


    passwordSuccess.classList.add("show");


    typingSuccess.textContent = "";


    let index = 0;


    function typeWriter(){

        if(index < text.length){

            typingSuccess.textContent += text.charAt(index);

            index++;


            typingTimer = setTimeout(
                typeWriter,
                40
            );

        }

    }


    typeWriter();

}

let successTimer;


function hidePasswordMessage(){

    clearTimeout(successTimer);


    passwordSuccess.classList.remove("show");

    typingSuccess.textContent = "";

}


// ======================================================
// BORDER PATH
// ======================================================

function getBorderPoint(

    distance,

    w,

    h

){

    const perimeter=(w*2)+(h*2);

    distance%=perimeter;

    let x=0;
    let y=0;

    if(distance<=w){

        x=distance;
        y=0;

    }

    else if(distance<=w+h){

        x=w;
        y=distance-w;

    }

    else if(distance<=w+h+w){

        x=w-(distance-w-h);
        y=h;

    }

    else{

        x=0;
        y=h-(distance-w-h-w);

    }

    return{

        x,
        y

    };

}

// ======================================================
// PASSWORD TOGGLE
// ======================================================

let passwordVisible = false;

passwordToggle.addEventListener("click", () => {

    passwordVisible = !passwordVisible;

    if (passwordVisible) {

        passwordInput.type = "text";

        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");

    }

});

// ======================================================
// CONFIRM PASSWORD
// ======================================================

function validateConfirmPassword(){

    const value = confirmPasswordInput.value;

            if(value === ""){

                clearStatus(passwordGroup);

                hidePasswordMessage();

                return;

            }

    if(value===passwordInput.value){

        setValid(confirmPasswordInput.parentElement);

    }else{

        setInvalid(confirmPasswordInput.parentElement);

    }

}

// ======================================================
// EVENTS
// ======================================================

fullnameInput.addEventListener("input",()=>{

    clearStatus(fullnameInput.parentElement);

    debounceValidate(

        fullnameInput,

        validateFullname

    );

});

// ------------------------------------------------------

emailInput.addEventListener("input",()=>{

    clearStatus(emailInput.parentElement);

    debounceValidate(

        emailInput,

        validateEmail

    );

});

// ------------------------------------------------------

passwordInput.addEventListener("input",()=>{


    clearStatus(passwordGroup);


    // پاک کردن تایمر قبلی
    clearTimeout(
        debounceTimers[passwordInput.id]
    );


    if(passwordInput.value.trim() === ""){


        hidePasswordMessage();


        return;

    }



    debounceValidate(
        passwordInput,
        validatePassword
    );


});
// ------------------------------------------------------

confirmPasswordInput.addEventListener("input",()=>{

    clearStatus(confirmPasswordInput.parentElement);

    debounceValidate(

        confirmPasswordInput,

        validateConfirmPassword

    );

});

// ======================================================
// INIT
// ======================================================
registerForm.addEventListener("submit",(e)=>{

    e.preventDefault();


    console.log("REGISTER BUTTON CLICKED");


    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;



    // بررسی خالی بودن فیلدها

    if(
        fullname === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ){

        alert("لطفاً همه فیلدها را کامل کنید");

        return;

    }



    // بررسی ایمیل

    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if(!emailRegex.test(email)){

        alert("ایمیل معتبر نیست");

        return;

    }



    // بررسی رمز

    if(password.length < 8){

        alert("رمز باید حداقل ۸ کاراکتر باشد");

        return;

    }



    // بررسی تکرار رمز

    if(password !== confirmPassword){

        alert("رمز عبور و تکرار آن یکسان نیست");

        return;

    }



    // ذخیره موقت اطلاعات

    localStorage.setItem(
        "registerData",
        JSON.stringify({

            fullname,
            email,
            password

        })
    );



    // رفتن به صفحه OTP

    document.body.classList.add("page-leaving");


    setTimeout(()=>{

        window.location.href="verify-phone2.html";

    },350);


});