document.addEventListener(
"DOMContentLoaded",
async()=>{


console.log(
"RESULT PAGE READY"
);



// ===============================
// TOKEN
// ===============================

const token =
localStorage.getItem(
"authToken"
);



if(!token){

console.error(
"NO TOKEN"
);

return;

}




// ===============================
// EXAM ID
// ===============================


const examId =
sessionStorage.getItem(
"selectedExamId"
);



if(!examId){

console.error(
"EXAM ID NOT FOUND"
);

return;

}




console.log(
"RESULT EXAM ID:",
examId
);




// ===============================
// ELEMENTS
// ===============================


const questionCountValue =
document.getElementById(
"questionCountValue"
);



const examTimeValue =
document.getElementById(
"examTimeValue"
);



const answeredCountValue =
document.getElementById(
"answeredCountValue"
);



const examPercentValue =
document.getElementById(
"examPercentValue"
);



console.log(
"RESULT ELEMENTS READY"
);



});