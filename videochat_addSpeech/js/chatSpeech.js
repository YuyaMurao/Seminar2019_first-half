var config = {
    apiKey: "AIzaSyAA40QVz5hLlOze6rE2FAPsrRVHYaNg4PE",
    authDomain: "chatsample1-d5a84.firebaseapp.com",
    databaseURL: "https://chatsample1-d5a84.firebaseio.com",
    projectId: "chatsample1-d5a84",
    storageBucket: "chatsample1-d5a84.appspot.com",
    messagingSenderId: "984491803842",
};
firebase.initializeApp(config);

//データベースの読み書きの準備
const newPostRef = firebase.database();
let room = document.getElementById("js-room-id").value;
const userName = document.getElementById("js-user-id");
// const roomId = document.getElementById("js-room-id");
let output = document.getElementById("output");

//読み込み処理
function text() {
    newPostRef.ref(room).on("child_added", function(data) {
        const v = data.val(); //データ取得
        const k = data.key; //ユニークkey取得
        let str = "";
        str += '<li class="list" id ="list' + k + '">'
        str += '<div id="' + k + '" class="msg_main">'
        str += '<div class="msg_left">';
        str += '<div class="icon"><img src="img/icon.png" alt="" class="icon ' + v.username + '" width="30"></div>';
        str += '<div class="msg">';
        str += '<div class="name">' + v.username + '</div>';
        str += '<div class="text">' + v.text + '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="msg_right">';
        str += '<div class="time">' + v.time + '</div>';
        str += '</div>';
        str += '</div>';
        str += '</li>'

        output.innerHTML += str;

    });

}

function scrolltop() {
    $('#output').animate({ scrollTop: $('#output:last-child')[0].scrollHeight }, 'fast');
}

function time() {
    var date = new Date();
    var hh = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var sec = ("0" + date.getSeconds()).slice(-2);
    var time = hh + ":" + min + ":" + sec;
    return time;
}



/*スピーチ*/
const join = document.getElementById("js-join-trigger");
const leave = document.getElementById('end-call');
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';

function button_change_when_join() {
    join.disabled = true;
    leave.disabled = false;
    remove_room.disabled = false;
}


join.addEventListener('click', function() {
    button_change_when_join();
    room = document.getElementById("js-room-id").value;
    output = document.getElementById("output");
    speech.start();
    text();
    setTimeout('scrolltop()', 500);
});



speech.onresult = function(e) {
    if (e.results[0].isFinal) {
        var recognized_text = e.results[0][0].transcript;
        console.log(recognized_text);
        newPostRef.ref(room).push({
            username: userName.value,
            text: recognized_text,
            time: time()
        });
    }
    scrolltop();
}
speech.onend = function() {
    speech.start();
}