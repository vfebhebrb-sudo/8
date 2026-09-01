// =====================================================
// MOBILE EXAM PAGE
// USER DATA + ACTIVE EXAMS
// =====================================================


document.addEventListener(
"DOMContentLoaded",
async()=>{


console.log(
"MOBILE EXAM PAGE LOADED"
);



// =====================================================
// ELEMENTS
// =====================================================


const studentName =
document.getElementById(
"studentName"
);


const studentCandidateNumber =
document.getElementById(
"studentCandidateNumber"
);


const studyDays =
document.getElementById(
"studyDays"
);


const studentLeague =
document.getElementById(
"studentLeague"
);


const completedExams =
document.getElementById(
"completedExams"
);


const previousScore =
document.getElementById(
"previousScore"
);


const activeExamsList =
document.getElementById(
"activeExamsList"
);



// =====================================================
// API
// =====================================================


if(typeof API_URL === "undefined"){


console.error(
"API_URL پیدا نشد"
);


return;


}



console.log(
"API:",
API_URL
);




// =====================================================
// TOKEN
// =====================================================


const token =
localStorage.getItem(
"authToken"
);



if(!token){


console.warn(
"کاربر لاگین نیست"
);


return;


}



// =====================================================
// ICONS
// =====================================================


function refreshIcons(){


if(window.lucide){

lucide.createIcons();

}


}




// =====================================================
// LOAD USER
// =====================================================


async function loadUser(){


try{


const response =
await fetch(

`${API_URL}/auth/me`,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);


const data = 
await response.json();


console.log(
    "ME FULL RESPONSE:",
    data
);


console.log(
    "CANDIDATE NUMBER:",
    data.user?.candidateNumber
);


if(!response.ok){

throw new Error(
data.message
);

}



const user =
data.user;



studentName.textContent =
user.fullname || "کاربر";



studentCandidateNumber.textContent =
`شماره داوطلبی: ${
user.candidateNumber || "---"
}`;



studyDays.textContent =
`${user.studyDays || 0} روز`;



studentLeague.textContent =
user.league || "برنز";



completedExams.textContent =
`${user.completedExams || 0} آزمون`;



previousScore.textContent =
user.previousScore || 0;



localStorage.setItem(

"currentUser",

JSON.stringify(user)

);



}



catch(error){


console.error(
"USER ERROR:",
error
);


}



}




// =====================================================
// LOAD ACTIVE TESTS
// =====================================================


async function loadActiveTests(){


try{


console.log(
"Loading tests..."
);



const response =
await fetch(

`${API_URL}/tests`

);



const tests =
await response.json();



console.log(
"ACTIVE TESTS:",
tests
);



if(!Array.isArray(tests)
||
tests.length===0){



activeExamsList.innerHTML = `

<div class="no-exam">

<i data-lucide="file-x"></i>

<span>
آزمون فعالی وجود ندارد
</span>

</div>

`;



refreshIcons();

return;


}




activeExamsList.innerHTML = "";




tests.forEach(
(test)=>{



let icon =
"file-question";



if(test.subject?.includes("زیست")){

icon="book-open";

}

else if(test.subject?.includes("ریاضی")){

icon="calculator";

}

else if(test.subject?.includes("فیزیک")){

icon="atom";

}

else if(test.subject?.includes("شیمی")){

icon="flask-conical";

}




const card =
document.createElement(
"article"
);



card.className =
"exam-item";



card.innerHTML = `


<div class="exam-icon">

<i data-lucide="${icon}"></i>

</div>



<div class="exam-details">

<h4>
${test.title}
</h4>


<span>

${test.questionCount || 0}
سوال

•

${test.duration || 0}
دقیقه

</span>


</div>



<button

class="enter-exam-btn"

data-id="${test._id}"

>


<span>
ورود
</span>


<i data-lucide="arrow-left"></i>


</button>



`;




activeExamsList.appendChild(
card
);



}

);




refreshIcons();




// دکمه ها

document 
.querySelectorAll(".enter-exam-btn")
.forEach((btn)=>{


btn.onclick = ()=>{


const id =
btn.dataset.id;


console.log(
"SELECTED TEST:",
id
);


// ذخیره آیدی آزمون

essionStorage.setItem(
"selectedExamId",
id
);s


// رفتن به صفحه تست

window.location.href =
"صفحه تست.html";


};


});




}



catch(error){


console.error(
"TEST ERROR:",
error
);



activeExamsList.innerHTML = `

<div class="no-exam">

<i data-lucide="wifi-off"></i>

<span>
خطا در دریافت آزمون‌ها
</span>

</div>

`;



refreshIcons();


}



}




// =====================================================
// START
// =====================================================


await loadUser();


await loadActiveTests();



});