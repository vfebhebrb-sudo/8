// ======================================================
// CHANGE PASSWORD OTP SYSTEM
// سیستم بازیابی رمز عبور با کد تایید
// ======================================================



// ======================================================
// گرفتن المنت های صفحه
// برای دسترسی به ورودی ها و دکمه ها
// ======================================================


const phoneNumber =
document.getElementById("phoneNumber");


const phoneGroup =
document.getElementById("phoneGroup");


const sendCodeBtn =
document.getElementById("sendCodeBtn");


const editPhoneBtn =
document.getElementById("editPhoneBtn");


const otpForm =
document.getElementById("otpForm");


const otpBoxes =
document.querySelectorAll(".otp-box");


const passwordTab =
document.getElementById("passwordTab");


const newPassword =
document.getElementById("newPassword");


const repeatPassword =
document.getElementById("repeatPassword");


const changePasswordBtn =
document.getElementById("changePasswordBtn");




// وضعیت ارسال کد
let codeSent = false;




// ======================================================
// اعتبارسنجی شماره تلفن
// بررسی میکند شماره درست وارد شده یا نه
// ======================================================


function validatePhone(phone){

    return /^09\d{9}$/.test(phone);

}




// ======================================================
// نمایش پیام Toast
// پیام کوچک موفقیت یا خطا
// ======================================================


function showToast(message){


    const toast =
    document.getElementById("toast");


    if(!toast)
        return;


    const text =
    toast.querySelector("span");


    if(text)
        text.innerText = message;



    toast.classList.add("show");



    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);


}





// ======================================================
// ارسال کد تایید
// درخواست ارسال OTP به سرور
// ======================================================


if(sendCodeBtn){


sendCodeBtn.addEventListener(
"click",
async()=>{


const phone =
phoneNumber.value.trim();



if(!validatePhone(phone)){


    phoneGroup?.classList.add(
        "invalid"
    );


    setTimeout(()=>{

        phoneGroup?.classList.remove(
            "invalid"
        );

    },700);


    return;

}




try{


sendCodeBtn.disabled=true;



sendCodeBtn.innerHTML=`

<span>
در حال ارسال...
</span>

`;





const response =
await fetch(

`${API_URL}/password-reset/send-reset-otp`,

{


method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone

})


}

);





const data =
await response.json();




console.log(
"RESET OTP:",
data
);





if(!response.ok){


throw new Error(
data.message ||
"ارسال کد ناموفق بود"
);


}




// قفل کردن شماره

phoneNumber.disabled=true;



sendCodeBtn.innerHTML=`

<span>
کد ارسال شد ✓
</span>

<i class="fa-solid fa-check"></i>

`;




// فعال کردن باکس های کد

otpBoxes.forEach(box=>{

box.disabled=false;

});



codeSent=true;



}




catch(error){


console.log(error);



sendCodeBtn.disabled=false;



sendCodeBtn.innerHTML=`

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



alert(
error.message
);


}



});


}






// ======================================================
// ویرایش شماره
// فعال کردن دوباره شماره تلفن
// ======================================================


if(editPhoneBtn){


editPhoneBtn.addEventListener(
"click",
()=>{


phoneNumber.disabled=false;


phoneNumber.focus();



sendCodeBtn.disabled=false;



otpBoxes.forEach(box=>{


box.value="";


box.disabled=true;


});



codeSent=false;



sendCodeBtn.innerHTML=`

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



});


}






// ======================================================
// کنترل باکس های OTP
// حرکت خودکار بین خانه ها
// ======================================================


otpBoxes.forEach(
(box,index)=>{


box.disabled=true;



box.addEventListener(
"input",
()=>{


box.value =
box.value.replace(
/\D/g,
""
);



if(
box.value &&
index < otpBoxes.length-1
){

otpBoxes[index+1].focus();

}


});





box.addEventListener(
"keydown",
(e)=>{


if(
e.key==="Backspace" &&
!box.value &&
index>0
){

otpBoxes[index-1].focus();

}


});


});

// ======================================================
// VERIFY RESET OTP
// تایید کد ارسال شده
// ======================================================


if(otpForm){


otpForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const otpCode =
[...otpBoxes]
.map(box=>box.value)
.join("");



const phone =
phoneNumber.value.trim();





// بررسی کامل بودن کد

if(otpCode.length !== 4){


alert(
"کد تایید را کامل وارد کنید"
);


return;


}





try{



const response =
await fetch(

`${API_URL}/password-reset/verify-reset-otp`,

{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({


phone:phone,


otp:otpCode


})


}

);






const data =
await response.json();




console.log(
"VERIFY OTP:",
data
);






if(!response.ok){



alert(

data.message ||

"کد تایید اشتباه است"

);



return;



}






// نمایش پیام موفقیت

showToast(
"کد تایید شد ✓"
);






// ذخیره شماره برای مرحله تغییر رمز

sessionStorage.setItem(

"resetPhone",

phone

);







// رفتن به بخش رمز جدید

setTimeout(()=>{



if(otpForm){

otpForm.style.display="none";

}



if(passwordTab){


passwordTab.style.display="block";


passwordTab.style.opacity="1";


}


},1000);







}



catch(error){


console.log(

"VERIFY ERROR:",

error

);



alert(

"خطا در اتصال به سرور"

);



}



});


}









// ======================================================
// CHANGE PASSWORD
// ثبت رمز عبور جدید
// ======================================================


if(changePasswordBtn){



changePasswordBtn.addEventListener(

"click",

async()=>{






const password =
newPassword.value.trim();




const repeat =
repeatPassword.value.trim();








// بررسی خالی نبودن رمز


if(!password || !repeat){


alert(

"رمز عبور را کامل وارد کنید"

);


return;


}







// بررسی یکی بودن دو رمز


if(password !== repeat){


alert(

"تکرار رمز عبور صحیح نیست"

);


return;


}








// گرفتن شماره ذخیره شده


const phone =

sessionStorage.getItem(

"resetPhone"

);








if(!phone){


alert(

"اطلاعات کاربر پیدا نشد"

);


return;


}









try{





changePasswordBtn.disabled=true;




changePasswordBtn.innerHTML=`

<span>

در حال تغییر...

</span>

`;









const response =

await fetch(

`${API_URL}/password-reset/change-password`,

{


method:"POST",



headers:{


"Content-Type":

"application/json"


},



body:JSON.stringify({


phone:phone,


newPassword:password


})


}


);








const data =

await response.json();





console.log(

"CHANGE PASSWORD:",

data

);








if(!response.ok){


throw new Error(

data.message ||

"خطا در تغییر رمز"

);


}








// موفقیت

showToast(

"رمز عبور با موفقیت تغییر کرد ✓"

);







// پاک کردن اطلاعات موقت


sessionStorage.removeItem(

"resetPhone"

);








setTimeout(()=>{



const isMobile =
/Android|iPhone|iPad|iPod/i.test(
navigator.userAgent
);



if(isMobile){


window.location.href =
 "../گوشی/موبایل.html";


}
else{


window.location.href =
"../index1.html";


}



},1500);







}







catch(error){





console.log(

"CHANGE PASSWORD ERROR:",

error

);





alert(

error.message ||

"خطا در اتصال به سرور"

);








changePasswordBtn.disabled=false;





changePasswordBtn.innerHTML=`

<span>

ثبت رمز جدید

</span>


<i class="fa-solid fa-check"></i>

`;







}



});



}