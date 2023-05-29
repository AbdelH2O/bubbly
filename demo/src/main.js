import template from './views/index.html';
import './views/index.css';

const supportedAPI = ['init'];

let messages = [{
    id: 0,
    role: 'assistant',
    content: 'Hello, how can I help you?',
    timestamp: new Date().toLocaleTimeString(),
}];

messages.push = function() {
    const len = Array.prototype.push.apply(this, arguments);
    render();
    return len;
};

let interval;

let bubble = '';
let fingerprint = '';

function render() {
    const chatArea = document.querySelector('#chatbox__body');
    chatArea.innerHTML = '';
    messages.forEach((message) => {
        const el = document.createElement('div');
        // el
        el.classList.add('chatbox__body__message');
        el.classList.add(message.role === 'assistant' ? 'chatbox__body__message--left' : 'chatbox__body__message--right');
        el.innerHTML = 
        // `
        //     ${
        //         message.role === 'assistant' ?
        //         `<div class="chatbox__body__message__img">
        //             <img
        //                 src="https://avatars.dicebear.com/api/micah/4.svg"
        //                 id="img"
        //                 height="40px"
        //                 width="40px"
        //             />
        //         </div>` :
        //         ''
        //     }`
            `<div class="chatbox__body__message__text ${message.role === 'assistant'? 'left': 'right'}">
                <span ${message.content === 'Loading' ? 'id="loader"' : ''}>${message.content}</span>
            </div>
        `;
        // if the message is the loading message, add a loading animation (three dots) where the dots are added every 500ms until the message is replaced with the actual response
        if (message.content === 'Loading') {
            const loader = el.querySelector('#loader');
            const dots = ['.', '..', '...'];
            let i = 0;
            interval = setInterval(() => {
                loader.innerHTML = `Loading${dots[i]}`;
                i = (i + 1) % 3;
            }, 500);
            // replace the loading message with the actual response
        }
        chatArea.appendChild(el);
    });
    // scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

const scrolltoBottom = function() {
    const bodyWrapper =  document.querySelector(".chatbox__body__wrapper")
    bodyWrapper.scrollTop = bodyWrapper.scrollHeight;
}

let id = 1;

const url = 'https://app.getbubblyai.com/api/trpc/entity.sendMessage?batch=1';
const ticketUrl = 'https://bubbly-git-staging-bubbly.vercel.app/api/trpc/entity.raiseTicket?batch=1';
function app(window) {
    let globalObject = window[window['MyWidget']];
    let queue = globalObject.q;
    if (queue) {
        for (var i = 0; i < queue.length; i++) {
            if (queue[i][0].toLowerCase() == 'init') {
                bubble = queue[i][1].bubble_id;
                messages[0].content = queue[i][1].message;
            }
            else
                apiHandler(queue[i][0], queue[i][1]);
        }
    }
    globalObject = apiHandler;
    const { document } = window;

    const el = document.createElement('div');
    el.innerHTML = template;

    document.body.appendChild(el);
    render();
    const button = document.querySelector('#bubble_head');
    const chatArea = document.querySelector('#chat_area');
    const overall = document.querySelector('.bbly');
    const btnChatboxClose = document.querySelector('#btnChatboxClose');
    button.addEventListener('click', () => {
        // send('Hello, World!');
        // console.log('Hello, World!');
        // if(chatArea.style.display === 'block') {
        //     chatArea.style.display = 'none';
        // } else {
        //     chatArea.style.display = 'block';
        // }
        chatArea.classList.toggle('hide');
        overall.classList.toggle('sm-full');
        
    });
    btnChatboxClose.addEventListener("click", () => {
      chatArea.classList.toggle("hide");
      overall.classList.toggle("sm-full");
    });
    document.body.addEventListener('click', (e) => {
        // check if the click was inside the chat area and the chat area is not hidden
        if (!chatArea.contains(e.target) && !chatArea.classList.contains('hide') && !button.contains(e.target)) {
            chatArea.classList.toggle('hide');
            overall.classList.toggle('sm-full');
        }
    });
    const sendMessage = document.querySelector('#send_message');
    sendMessage.addEventListener('click', () => {
        const text = document.querySelector('#message').value;
        send(text);
        document.querySelector('#message').value = '';
        scrolltoBottom()
    });
    // listen for enter key press to send message and clear input while the chat area is not hidden
    document.querySelector('#message').addEventListener('keyup', (e) => {
        
        // change send button icon on text input
        if(e.target.value && e.target.value != ''){
            document.querySelector('#send_message').disabled = false
        }else{
            document.querySelector("#send_message").disabled = true;
        }
        if (e.key === 'Enter' && !chatArea.classList.contains('hide')) {
            const text = document.querySelector('#message').value;
            send(text);
            document.querySelector('#message').value = '';
            scrolltoBottom()
        }
    });
    // console.log('Hello, World!');
    const raiseTicketButton = document.querySelector('.raiseTicket');
    const modal = document.querySelector('#modal');
    const modalContent = document.querySelector('.modal-content');
    const closeButton = document.querySelector('.close');

    modal.addEventListener('click', (e) => {
        if (!modalContent.contains(e.target)) {
            modal.style.display = 'none';
            console.log('clicked');
        }
    });

    raiseTicketButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        chatArea.classList.toggle("hide");
    });
    
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        chatArea.classList.toggle("hide");
    });

    const submitButton = document.querySelector('#submitTicket');
    submitButton.addEventListener('click', (e) => {
        const btn = e.target;
        btn.disabled = true;
        btn.innerHTML = 'Submitting...';
        btn.style.opacity = 0.8;
        btn.style.cursor = 'not-allowed';
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#msg').value;
        const data = {
            bubble_id: bubble,
            email,
            message,
            fingerprint
        };
        console.log(data);
        fetch(ticketUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                0: {
                    json: data,
                },
            }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                modal.style.display = 'none';
                chatArea.classList.toggle("hide");
                btn.disabled = false;
                btn.innerHTML = 'Submit';
                btn.style.opacity = 1;
                btn.style.cursor = 'pointer';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

function send(text) {
    messages.push({
        id: id++,
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString(),
    });
    messages.push({
        id: id++,
        role: 'assistant',
        content: 'Loading',
        timestamp: new Date().toLocaleTimeString(),
    });
    // disable the send button
    document.querySelector('#send_message').disabled = true;
    document.querySelector('#send_message').classList.toggle('disabled');
    // simulate waiting for a response
    // setTimeout(() => {
    //     messages.pop();
    //     messages.push({
    //         id: id++,
    //         role: 'assistant',
    //         content: 'Hello, World!',
    //         timestamp: new Date().toLocaleTimeString(),
    //     });
    //     // enable the send button and toggle the disabled class
    //     document.querySelector('#send_message').disabled = false;
    //     document.querySelector('#send_message').classList.toggle('disabled');
        
    //     // clear the loading animation
    //     clearInterval(interval);
    // }, 5000);


    // send POST request to the url with the text
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            0: {
                json: {
                    bubble_id: bubble,
                    // remove the loading message
                    messages: messages.slice(0, -1),
                    fingerprint: fingerprint,
                }
            }
        }),
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        messages.pop();
        messages.push({
            id: id++,
            role: 'assistant',
            content: data[0].result.data.json.data.message.content,
            timestamp: new Date().toLocaleTimeString(),
        });
        document.querySelector('#send_message').disabled = false;
        document.querySelector('#send_message').classList.toggle('disabled');
        
        // clear the loading animation
        clearInterval(interval);
        scrolltoBottom()
    }).catch((error) => {
        console.error(error);
    });
}

function apiHandler(api, params) {
    if (!api) throw Error('API method required');
    api = api.toLowerCase();

    if (supportedAPI.indexOf(api) === -1) throw Error(`Method ${api} is not supported`);

    console.log(`Handling API call ${api}`, params);

    switch (api) {
        // TODO: add API implementation
        case 'message':
            // show(params);
            break;
        default:
            console.warn(`No handler defined for ${api}`);
    }
}

const fpPromise = import('@fingerprintjs/fingerprintjs')
    .then(FingerprintJS => FingerprintJS.load());
fpPromise.then(fp => {
    fp.get().then(result => {
        console.log(result.visitorId);
        fingerprint = result.visitorId;
    });
});
app(window);