// ======================================================
// MOBILE CHAT OPEN / CLOSE + LOAD CHATS
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const chatPanel = document.getElementById("chatPanel");

const conversation = document.getElementById("conversation");

const mobileBackBtn = document.getElementById("mobileBackBtn");


const chatList = document.getElementById("chatList");

// ======================================================
// CURRENT USER
// ======================================================

const savedUser = localStorage.getItem(
    "currentUser"
);


const chatUser = savedUser
    ? JSON.parse(savedUser)
    : null;



console.log(
    "🔥 CURRENT USER:",
    chatUser
);




// ======================================================
// OPEN MOBILE CHAT
// ======================================================

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




// ======================================================
// CLOSE MOBILE CHAT
// ======================================================

function closeChatMobile(){


    chatPanel?.classList.remove(
        "hide-panel"
    );


    conversation?.classList.remove(
        "show-chat"
    );


}




// ======================================================
// BACK BUTTON
// ======================================================

if(mobileBackBtn){


    mobileBackBtn.addEventListener(
        "click",
        ()=>{

            closeChatMobile();

        }
    );


}




// ======================================================
// LOAD USER CHATS FROM DATABASE
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

            API +
            `/chat/user/${chatUser.phone}`;



        console.log(
            "🌍 REQUEST:",
            url
        );



        const response =

            await fetch(url);



        console.log(
            "STATUS:",
            response.status
        );



        const data =

            await response.json();



        console.log(
            "🔥 SERVER DATA:",
            data
        );





        if(
            !data.success ||
            !Array.isArray(data.chats)
        ){


            console.log(
                "⚠️ NO DATABASE CHATS"
            );


            chats = [
                ...staticChats
            ];


            renderChats();


            return;

        }





        // ترکیب چت ثابت + دیتابیس


        chats = [

            ...staticChats,

            ...data.chats

        ];



        console.log(
            "🔥 FINAL CHATS:",
            chats
        );



       createChatCards();



    }


    catch(error){


        console.log(
            "🔥 LOAD CHAT ERROR:",
            error
        );


    }



}



// ======================================================
// CREATE CHAT CARDS
// ======================================================

function renderChats(){


    const chatList = document.getElementById(
        "chatList"
    );


    if(!chatList){

        console.log(
            "❌ chatList پیدا نشد"
        );

        return;

    }



    chatList.innerHTML = "";



    chats.forEach(chat=>{


        const item = document.createElement(
            "div"
        );


        item.className = "chat-item";


        item.dataset.chatId = chat._id;


        item.dataset.type = chat.type;



        let icon = "user";


        if(chat.type === "ai"){

            icon = "bot";

        }

        else if(chat.type === "group"){

            icon = "users";

        }

        else if(chat.type === "channel"){

            icon = "megaphone";

        }



        item.innerHTML = `


        <div class="ai-avatar">


            <i data-lucide="${icon}"></i>


        </div>



        <div class="chat-info">


            <div class="chat-name">


                <strong>

                    ${chat.name || "بدون نام"}

                    ${
                        chat.type === "ai"
                        ?
                        `<span class="verified">✓</span>`
                        :
                        ""
                    }

                </strong>


                <time>

                    ${
                        chat.type === "ai"
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
        "🔥 CHAT CARDS CREATED:",
        chatList.children.length
    );


}






// ======================================================
// CLICK CHAT
// ======================================================

document.addEventListener(
    "click",
    function(event){


        const item =

            event.target.closest(
                ".chat-item"
            );



        if(!item){

            return;

        }



        console.log(
            "🔥 OPEN CHAT:",
            item.dataset.chatId
        );



        openChatMobile();



    }
);




// ======================================================
// START
// ======================================================


loadUserChats();





// ======================================================
// CREATE CHAT CARDS
// ساخت کارت های چت
// ======================================================

function createChatCards(){

    if(!chatList){

        console.log("❌ chatList پیدا نشد");
        return;

    }


    chatList.innerHTML = "";


    chats.forEach(chat=>{


        const item = document.createElement("div");


        item.className = "chat-item";


        item.dataset.chatId = chat._id;


        item.dataset.type = chat.type;



        let icon = "user";


        if(chat.type === "group"){

            icon = "users";

        }

        else if(chat.type === "channel"){

            icon = "megaphone";

        }

        else if(chat.type === "ai"){

            icon = "bot";

        }



        item.innerHTML = `


        <div class="profile-icon ${chat.type}">

            <i data-lucide="${icon}"></i>

        </div>



        <div class="chat-info">


            <div class="chat-name">


                <strong>

                    ${chat.name || "بدون نام"}

                </strong>



                ${
                    chat.type === "ai"

                    ?

                    `<span class="verified">
                        ✓
                    </span>`

                    :

                    ""

                }



                <time>

                    ${
                        chat.type === "ai"

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

                    ?

                    chat.lastMessage

                    :

                    "پیامی وجود ندارد"

                }

            </p>



        </div>


        `;



        chatList.appendChild(item);


    });



    // فعال کردن آیکون ها

    if(typeof lucide !== "undefined"){

        lucide.createIcons();

    }


    console.log(
        "🔥 CHAT CARDS CREATED:",
        chatList.children.length
    );


}














// ======================================================
// RENDER CHAT CARDS
// ======================================================

function renderChats(){

    const chatList = document.getElementById("chatList");


    if(!chatList){
        console.log("❌ chatList پیدا نشد");
        return;
    }


    chatList.innerHTML = "";


    chats.forEach(chat=>{


        const div = document.createElement("div");


        div.className = "chat-item";


        div.dataset.chatId = chat._id;


        div.dataset.type = chat.type;



        let icon = "users";


        if(chat.type === "ai"){
            icon = "bot";
        }

        else if(chat.type === "channel"){
            icon = "megaphone";
        }

        else if(chat.type === "private"){
            icon = "user";
        }



        div.innerHTML = `


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
                    `<span class="verified">✓</span>`
                    :
                    ""
                }


                <time>

                ${
                    chat.type==="ai"
                    ?
                    "آنلاین"
                    :
                    chat.type || ""

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



        chatList.appendChild(div);


    });



    if(typeof lucide !== "undefined"){

        lucide.createIcons();

    }



    console.log(
        "🔥 CHAT CARDS CREATED:",
        chatList.children.length
    );


}