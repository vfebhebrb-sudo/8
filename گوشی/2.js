
// ======================================================
// MOBILE CHAT + DATABASE + MESSAGES
// ======================================================


// ===============================
// ELEMENTS
// ===============================

const chatPanel =
    document.getElementById("chatPanel");

const conversation =
    document.getElementById("conversation");

const mobileBackBtn =
    document.getElementById("mobileBackBtn");

const chatList =
    document.getElementById("chatList");

const messagesContainer =
    document.getElementById("messagesContainer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");


// ===============================
// API
// ===============================

const API = API_URL;


// ===============================
// CURRENT USER
// ===============================

const savedUser =
    localStorage.getItem("currentUser");

const chatUser =
    savedUser
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
// CURRENT CHAT
// ===============================

let currentChatId = null;


// ======================================================
// MOBILE OPEN
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
// MOBILE CLOSE
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
                "⚠️ NO CHATS"
            );

            return;

        }


        chats =
            data.chats;


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


        const item =
            document.createElement("div");


        item.className =
            "chat-item";


        item.dataset.chatId =
            chat._id;


        item.dataset.type =
            chat.type;


        let icon =
            "user";


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

        <div class="profile-icon">

            <i data-lucide="${icon}"></i>

        </div>


        <div class="chat-info">


            <div class="chat-name">


                <strong>

                    ${escapeHTML(
                        chat.name || "بدون نام"
                    )}

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

                        escapeHTML(
                            chat.type || ""
                        )
                    }

                </time>


            </div>


            <p>

                ${
                    chat.lastMessage

                    ?

                    escapeHTML(
                        chat.lastMessage
                    )

                    :

                    "پیامی وجود ندارد"
                }

            </p>


        </div>

        `;


        chatList.appendChild(
            item
        );


    });


    if(
        typeof lucide !== "undefined"
    ){

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
            e.target.closest(
                ".chat-item"
            );


        if(!item){

            return;

        }


        const chatId =
            item.dataset.chatId;


        console.log(
            "🔥 OPEN CHAT:",
            chatId
        );


        // ذخیره چت فعلی
        currentChatId =
            chatId;


        // فعال کردن کارت
        document
            .querySelectorAll(".chat-item")
            .forEach(chat => {

                chat.classList.remove(
                    "active"
                );

            });


        item.classList.add(
            "active"
        );


        // باز کردن گفتگو
        openChatMobile();


        // دریافت پیام ها
        loadChatMessages(
            chatId
        );

    }
);


// ======================================================
// LOAD CHAT MESSAGES
// ======================================================

async function loadChatMessages(
    chatId
){

    console.log(
        "📨 LOAD MESSAGES:",
        chatId
    );


    if(!messagesContainer){

        console.log(
            "❌ messagesContainer not found"
        );

        return;

    }


    if(!chatId){

        console.log(
            "❌ CHAT ID NOT FOUND"
        );

        return;

    }


    messagesContainer.innerHTML = `

        <div class="messages-loading">

            در حال دریافت پیام‌ها...

        </div>

    `;


    try{

        const url =
            `${API}/chat/messages/${chatId}`;


        console.log(
            "🌍 MESSAGE REQUEST:",
            url
        );


        const response =
            await fetch(url);


        console.log(
            "📡 MESSAGE STATUS:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "📨 MESSAGE DATA:",
            data
        );


        if(
            !data.success ||
            !Array.isArray(data.messages)
        ){

            messagesContainer.innerHTML = `

                <div class="empty-messages">

                    هنوز پیامی وجود ندارد

                </div>

            `;

            return;

        }


        renderMessages(
            data.messages
        );

    }


    catch(error){

        console.error(
            "❌ LOAD MESSAGES ERROR:",
            error
        );


        messagesContainer.innerHTML = `

            <div class="empty-messages">

                دریافت پیام‌ها انجام نشد

            </div>

        `;

    }

}


// ======================================================
// RENDER MESSAGES
// ======================================================

function renderMessages(
    messages
){

    if(!messagesContainer){

        return;

    }


    messagesContainer.innerHTML = "";


    if(!messages.length){

        messagesContainer.innerHTML = `

            <div class="empty-messages">

                هنوز پیامی وجود ندارد

            </div>

        `;

        return;

    }


    messages.forEach(
        message => {


            const isMe =
                chatUser &&
                message.sender ===
                chatUser.phone;


            const messageElement =
                document.createElement(
                    "div"
                );


            messageElement.className =
                isMe
                    ? "message received"
                    : "message sent";


            messageElement.dataset.messageId =
                message._id;


            let senderName = "";


            if(
                !isMe &&
                message.senderName
            ){

                senderName = `

                    <div class="message-sender">

                        ${escapeHTML(
                            message.senderName
                        )}

                    </div>

                `;

            }

messageElement.innerHTML = `

    <div class="message-content">

        ${
            senderName
                ? `
                    <div class="message-sender-wrap">

                        ${senderName}

                    </div>
                `
                : ""
        }


        ${
            message.text
                ? `
                    <div class="message-body">

                        <div class="message-text">

                            ${escapeHTML(
                                message.text
                            )}

                        </div>

                    </div>
                `
                : ""
        }


        <div class="message-footer">

            <span class="message-time">

                ${formatMessageTime(
                    message.createdAt
                )}

            </span>

        </div>

    </div>

`;

            messagesContainer.appendChild(
                messageElement
            );

        }
    );


    scrollMessagesToBottom();

}


// ======================================================
// SEND MESSAGE
// ======================================================

async function sendMessage(){

    if(!messageInput){

        return;

    }


    const text =
        messageInput.value.trim();


    if(!text){

        return;

    }


    if(!currentChatId){

        console.log(
            "❌ NO CURRENT CHAT"
        );

        return;

    }


    if(!chatUser){

        console.log(
            "❌ USER NOT LOGIN"
        );

        return;

    }


    // جلوگیری از چند ارسال همزمان
    if(sendBtn){

        sendBtn.disabled = true;

    }


    try{

        const formData =
            new FormData();


        formData.append(
            "chatId",
            currentChatId
        );


        formData.append(
            "sender",
            chatUser.phone
        );


        formData.append(
            "text",
            text
        );


        formData.append(
            "senderName",
            chatUser.fullname || "کاربر"
        );


        formData.append(
            "senderType",
            "user"
        );


        console.log(
            "📤 SEND MESSAGE:",
            {
                chatId: currentChatId,
                sender: chatUser.phone,
                text: text
            }
        );


        const response =
            await fetch(
                `${API}/chat/message`,
                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "📡 SEND STATUS:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "📤 SEND RESPONSE:",
            data
        );


        if(
            !data.success
        ){

            console.log(
                "❌ MESSAGE SEND FAILED"
            );

            return;

        }


        // پاک کردن input
        messageInput.value = "";


        // اضافه کردن پیام جدید
        if(data.data){

            appendMessage(
                data.data
            );

        }


        // بروزرسانی آخرین پیام کارت
        updateChatLastMessage(
            currentChatId,
            text
        );

    }


    catch(error){

        console.error(
            "❌ SEND MESSAGE ERROR:",
            error
        );

    }


    finally{

        if(sendBtn){

            sendBtn.disabled = false;

        }

        messageInput.focus();

    }

}


// ======================================================
// APPEND NEW MESSAGE
// ======================================================

function appendMessage(
    message
){

    if(!messagesContainer){

        return;

    }


    // اگر پیام قبلاً وجود دارد
    if(
        message._id &&
        messagesContainer.querySelector(
            `[data-message-id="${message._id}"]`
        )
    ){

        return;

    }


    const isMe =
        chatUser &&
        message.sender ===
        chatUser.phone;


    const messageElement =
        document.createElement(
            "div"
        );


messageElement.className =
    isMe
        ? "message received"
        : "message sent";


    messageElement.dataset.messageId =
        message._id || "";


    let senderName = "";


    if(
        !isMe &&
        message.senderName
    ){

        senderName = `

            <div class="message-sender">

                ${escapeHTML(
                    message.senderName
                )}

            </div>

        `;

    }


    messageElement.innerHTML = `

        <div class="message-content">

            ${senderName}


            <div class="message-text">

                ${escapeHTML(
                    message.text || ""
                )}

            </div>


            <div class="message-time">

                ${formatMessageTime(
                    message.createdAt
                )}

            </div>

        </div>

    `;


    messagesContainer.appendChild(
        messageElement
    );


    scrollMessagesToBottom();

}


// ======================================================
// UPDATE LAST MESSAGE
// ======================================================

function updateChatLastMessage(
    chatId,
    text
){

    const chat =
        chats.find(
            chat =>
                String(chat._id) ===
                String(chatId)
        );


    if(chat){

        chat.lastMessage =
            text;

    }


    const item =
        document.querySelector(
            `.chat-item[data-chat-id="${chatId}"]`
        );


    if(item){

        const preview =
            item.querySelector(
                ".chat-info p"
            );


        if(preview){

            preview.textContent =
                text;

        }

    }

}


// ======================================================
// FORMAT MESSAGE TIME
// ======================================================

function formatMessageTime(
    date
){

    if(!date){

        return "";

    }


    const messageDate =
        new Date(date);


    if(
        Number.isNaN(
            messageDate.getTime()
        )
    ){

        return "";

    }


    return messageDate.toLocaleTimeString(
        "fa-IR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ======================================================
// SCROLL TO BOTTOM
// ======================================================

function scrollMessagesToBottom(){

    if(!messagesContainer){

        return;

    }


    requestAnimationFrame(
        () => {

            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;

        }
    );

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(
    text
){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


// ======================================================
// SEND BUTTON
// ======================================================

if(sendBtn){

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}


// ======================================================
// ENTER TO SEND
// ======================================================

if(messageInput){

    messageInput.addEventListener(
        "keydown",
        (event)=>{

            if(
                event.key === "Enter" &&
                !event.shiftKey
            ){

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// ======================================================
// START
// ======================================================

loadUserChats();

