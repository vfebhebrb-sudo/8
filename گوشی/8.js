document.addEventListener(
"DOMContentLoaded",
async ()=>{


console.log("TEST PAGE LOADED");



// =====================================================
// ICONS
// =====================================================

function refreshIcons(){

    if(window.lucide){

        lucide.createIcons();

    }

}





// =====================================================
// CHECK API
// =====================================================


if(typeof API_URL === "undefined"){

    console.error("API_URL پیدا نشد");

    return;

}





// =====================================================
// TOKEN
// =====================================================


const token =
localStorage.getItem("authToken");



if(!token){

    console.error("کاربر لاگین نیست");

    return;

}





// =====================================================
// ELEMENTS
// =====================================================


const studentName =
document.getElementById("studentName");


const studentCandidateNumber =
document.getElementById("studentCandidateNumber");


const testTitle =
document.getElementById("testTitle");


const testSubject =
document.getElementById("testSubject");


const testCount =
document.getElementById("testCount");


const testDuration =
document.getElementById("testDuration");


const startExamBtn =
document.getElementById("startExamBtn");


const startOverlay =
document.getElementById("startOverlay");


const questionSlider =
document.getElementById("questionSlider");


const timerDisplay =
document.getElementById("timer");


const testStatusGrid =
document.getElementById("testStatusGrid");







// =====================================================
// DATA
// =====================================================


let allQuestions = [];

let currentQuestion = 0;

let examDuration = 0;

let timerInterval = null;

let remainingSeconds = 0;







// =====================================================
// TIMER
// =====================================================


function startTimer(minutes){


    clearInterval(timerInterval);


    remainingSeconds = minutes * 60;



    timerInterval =
    setInterval(()=>{


        let min =
        Math.floor(
            remainingSeconds / 60
        );


        let sec =
        remainingSeconds % 60;



        timerDisplay.textContent =

        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;



        if(remainingSeconds <= 0){


            clearInterval(timerInterval);


            alert(
            "زمان آزمون تمام شد"
            );


            return;

        }



        remainingSeconds--;



    },1000);



}









// =====================================================
// EXAM ID
// =====================================================


const examId =
sessionStorage.getItem(
"selectedExamId"
);



if(!examId){

    console.error(
    "آزمون انتخاب نشده"
    );

    return;

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



const user =
data.user;




if(studentName){

studentName.textContent =
user.fullname || "کاربر";

}




if(studentCandidateNumber){

studentCandidateNumber.textContent =

`شماره داوطلبی: ${user.candidateNumber || "---"}`;

}




}

catch(error){

console.error(
"USER ERROR:",
error
);


}


}









// =====================================================
// LOAD EXAM
// =====================================================


async function loadExam(){


try{


const response =
await fetch(

`${API_URL}/tests/${examId}`

);



const data =
await response.json();



console.log(
"EXAM DATA:",
data
);



if(!response.ok){

throw new Error(
data.message ||
"خطا در دریافت آزمون"
);

}



const test =
data.test;





// اطلاعات آزمون


testTitle.textContent =
test.title || "-";



testSubject.textContent =
test.subject || "-";



testCount.textContent =

`${test.questions.length} سوال`;



testDuration.textContent =

`${test.duration} دقیقه`;







// ذخیره سوالات


allQuestions =
test.questions;



examDuration =
test.duration;




// فقط برای تست فعلا


console.log(
"QUESTIONS:",
allQuestions
);





createStatusButtons(
allQuestions.length
);





enableStartExam();



}


catch(error){


console.error(
"EXAM ERROR:",
error
);


}


}








// =====================================================
// START EXAM
// =====================================================


function enableStartExam(){


if(!startExamBtn)
return;




startExamBtn.onclick = ()=>{


console.log(
"EXAM STARTED"
);




// حذف صفحه شروع

if(startOverlay){

startOverlay.remove();

}





// شروع زمان


startTimer(
examDuration
);





// فعلا فقط نمایش کنسول


currentQuestion = 0;

renderQuestion(
currentQuestion
);

// بعداً اینجا UI سوال می‌آید


};


}








// =====================================================
// START
// =====================================================


await loadUser();


await loadExam();



refreshIcons();



});

// =====================================================
// QUESTION SYSTEM
// =====================================================


function renderQuestion(index){


    const q = allQuestions[index];


    if(!q)
    return;



    console.log(
        "SHOW QUESTION:",
        index + 1,
        q
    );



    questionSlider.innerHTML = `


    <div class="question-item">


        <div class="question-header">

            <span>
            سوال ${index + 1}
            </span>

        </div>



        <div class="question-text">

            ${q.question}

        </div>





        <div class="question-options">


        ${
            q.options.map(
            (option,i)=>`


            <button

            class="answer-option"

            data-question="${index}"

            data-answer="${i}"

            >

            ${option}

            </button>


            `
            ).join("")
        }


        </div>






        <div 
        class="question-navigation"
        id="questionNavigation">



            <button

            id="prevQuestion"

            class="question-nav-btn prev-btn">

            <i data-lucide="chevron-left"></i>

            سوال قبل

            </button>





            <button

            id="nextQuestion"

            class="question-nav-btn next-btn">

            سوال بعد

            <i data-lucide="chevron-right"></i>

            </button>



        </div>




    </div>


    `;



    refreshIcons();


    bindNavigation();


    addAnswerEvents();


    updateNavigation();



}









// =====================================================
// NAVIGATION
// =====================================================


function bindNavigation(){



const next =
document.getElementById(
"nextQuestion"
);



const prev =
document.getElementById(
"prevQuestion"
);





if(next){


next.onclick = ()=>{


// اگر آخرین سوال بود

if(currentQuestion === allQuestions.length - 1){


submitAnswers();


return;

}




currentQuestion++;


renderQuestion(
currentQuestion
);



};


}






if(prev){


prev.onclick = ()=>{


if(currentQuestion > 0){


currentQuestion--;


renderQuestion(
currentQuestion
);



}


};


}



}










// =====================================================
// BUTTON STATE
// =====================================================


function updateNavigation(){



const prev =
document.getElementById(
"prevQuestion"
);



const next =
document.getElementById(
"nextQuestion"
);




if(!prev || !next)
return;







// سوال اول

if(currentQuestion === 0){


prev.style.display =
"none";


}

else{


prev.style.display =
"flex";


}









// سوال آخر


if(currentQuestion === allQuestions.length - 1){



next.innerHTML = `


<i data-lucide="send"></i>

ثبت پاسخنامه


`;



next.classList.add(
"submit-answer-btn"
);



}

else{



next.innerHTML = `


سوال بعد


<i data-lucide="chevron-right"></i>


`;



next.classList.remove(
"submit-answer-btn"
);



}



refreshIcons();



}









// =====================================================
// ANSWERS
// =====================================================


function addAnswerEvents(){



document
.querySelectorAll(
".answer-option"
)
.forEach(
btn=>{


btn.onclick = ()=>{


const question =
btn.dataset.question;




document
.querySelectorAll(

`[data-question="${question}"]`

)
.forEach(
item=>{


item.classList.remove(
"selected"
);


});




btn.classList.add(
"selected"
);




console.log(
"ANSWER:",
question,
btn.dataset.answer
);



};



});



}









// =====================================================
// SUBMIT
// =====================================================


function submitAnswers(){


console.log(
"SUBMIT ANSWERS"
);



alert(
"پاسخنامه ثبت شد"
);



}










// =====================================================
// STATUS BUTTONS
// =====================================================


function createStatusButtons(count){



if(!testStatusGrid)
return;



testStatusGrid.innerHTML = "";



for(
let i=0;
i<count;
i++
){


const btn =
document.createElement(
"button"
);



btn.textContent =
i+1;



btn.className =
"status-number";



btn.dataset.question =
i;





btn.onclick = ()=>{


currentQuestion =
i;


renderQuestion(
currentQuestion
);



};



testStatusGrid.appendChild(
btn
);



}



}