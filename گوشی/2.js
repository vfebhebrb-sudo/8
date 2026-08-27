// ======================================================
// MOBILE CHAT + DATABASE LOAD
// ======================================================


// ===============================
// ELEMENTS
// ===============================

const chatPanel = document.getElementById("chatPanel");

const conversation = document.getElementById("conversation");

const mobileBackBtn = document.getElementById("mobileBackBtn");

const chatList = document.getElementById("chatList");




// ===============================
// API
// ===============================

const API = API_URL;




// ===============================
// CURRENT USER
// ===============================

const savedUser = localStorage.getItem("currentUser");


const chatUser = savedUser
    ? JSON.parse(savedUser)
    : null;



console.log(
    "🔥 CURRENT USER:",
    chatUser
);




// ===============================
// CHAT DATA
// ===============================

let chats = [];




// ===============================
// MOBILE OPEN
// ===============================

function openChatMobile(){

    if(window.innerWidth <= 768){

        chatPanel?.classList.add(
            "hide-panel"
        );


        conversation?.classList.add(
            "show-chat"
        );

    }

}




// ===============================
// MOBILE CLOSE
// ===============================

function closeChatMobile(){

    chatPanel?.classList.remove(
        "hide-panel"
    );


    conversation?.classList.remove(
        "show-chat"
    );

}




// ===============================
// BACK BUTTON
// ===============================

if(mobileBackBtn){

    mobileBackBtn.addEventListener(
        "click",
        closeChatMobile
    );

}




// ======================================================
// LOAD CHATS FROM DATABASE
// ======================================================


async function loadUserChats(){


    console.log(
        "🔥 LOAD USER CHATS START"
    );



    if(!chatUser){

        console.log(
            "❌ USER NOT LOGIN"
        );

        return;

    }



    try{


        const url =

        `${API}/chat/user/${chatUser.phone}`;



        console.log(
            "🌍 REQUEST:",
            url
        );



        const response = await fetch(url);



        console.log(
            "STATUS:",
            response.status
        );



        const data = await response.json();



        console.log(
            "🔥 SERVER DATA:",
            data
        );



        if(
            !data.success ||
            !Array.isArray(data.chats)
        ){

            console.log(
                "⚠️ NO CHATS"
            );

            return;

        }




        chats = data.chats;



        console.log(
            "🔥 CHATS:",
            chats
        );



        createChatCards();



    }


    catch(error){


        console.log(
            "🔥 LOAD ERROR:",
            error
        );


    }



}






// ======================================================
// CREATE CHAT CARDS
// ======================================================


function createChatCards(){


    if(!chatList){

        console.log(
            "❌ chatList not found"
        );

        return;

    }



    chatList.innerHTML = "";




    chats.forEach(chat=>{


        const item = document.createElement(
            "div"
        );



        item.className =
        "chat-item";



        item.dataset.chatId =
        chat._id;



        item.dataset.type =
        chat.type;




        let icon = "user";



        if(chat.type === "ai"){

            icon="bot";

        }


        else if(chat.type==="group"){

            icon="users";

        }


        else if(chat.type==="channel"){

            icon="megaphone";

        }




        item.innerHTML = `


        <div class="profile-icon">


            <i data-lucide="${icon}"></i>


        </div>




        <div class="chat-info">



            <div class="chat-name">


                <strong>

                    ${chat.name || "بدون نام"}

                </strong>


                ${
                    chat.type==="ai"

                    ?

                    `<span class="verified">
                        ✓
                    </span>`

                    :

                    ""

                }



                <time>

                    ${
                        chat.type==="ai"

                        ?

                        "آنلاین"

                        :

                        chat.type

                    }

                </time>



            </div>




            <p>

                ${
                    chat.lastMessage

                    ||

                    "پیامی وجود ندارد"

                }

            </p>




        </div>


        `;



        chatList.appendChild(
            item
        );



    });





    if(typeof lucide !== "undefined"){

        lucide.createIcons();

    }



    console.log(
        "🔥 CARDS CREATED:",
        chatList.children.length
    );



}






// ======================================================
// CLICK CHAT
// ======================================================


document.addEventListener(
"click",
(e)=>{


    const item =
    e.target.closest(".chat-item");



    if(!item){

        return;

    }



    console.log(
        "🔥 OPEN CHAT:",
        item.dataset.chatId
    );



    openChatMobile();



});





// ======================================================
// START
// ======================================================


loadUserChats();