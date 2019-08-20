const database = firebase.database();
let user_name, room_name, title, exit_button, name_list, board, tag, tag_name, tag_list, tag_text, send_button, error_text, tag_create_text, create_tag_button;

window.onload = function main() {
    user_name = document.getElementById("user_name").textContent;
    room_name = document.getElementById("room_name").textContent;
    write_user_name();

    title = document.getElementById("title");
    title.textContent = room_name + " Room";

    exit_button = document.getElementById("exit_button");
    exit_button.addEventListener('click', exit);

    send_button = document.getElementById("send_button");
    send_button.addEventListener('click', judge_write);

    create_tag_button = document.getElementById("create_tag_button");
    create_tag_button.addEventListener('click', create_tag);

    read_user_list();
    read_tag_for_display()

    read_tag_list_for_tag_select();
}

function write_user_name() {
    //入室したときにユーザ名をデータベースに格納する(用途:ユーザ一覧)
    database.ref(room_name + `/user_list/` + user_name).update({
        user_name: user_name
    });
}

function exit() {
    //ページ遷移(退出)
    window.location.href = "../index.html";
}

function judge_write() {
    //データベースに書き込めるのか判断して書き込めない場合はエラー文を表示する
    tag_name = document.getElementById("tag_name");
    tag_text = document.getElementById("tag_text");
    error_text = document.getElementById("error_text");
    if (tag_name.value === "") {
        if (tag_text.value === "") {
            error_text.textContent = "両方もしくはタグ名を入力してください";
        } else {
            error_text.textContent = "タグ名を入力してください";
        }
    } else {
        if (tag_text.value === "") {
            write_tag();
            tag_name.value = "";
        } else {
            write_text();
            tag_name.value = tag_text.value = "";
            error_text.textContent = "";
        }
    }
}

function write_tag() {
    //タグ名のみの入力のときの書き込み
    database.ref(room_name + `/board/` + tag_name.value).update({
        tag_name: tag_name.value
    });
    console.log("Create New Tag");
}

function write_text() {
    //タグ名とテキスト入力されたときの書き込み

    /*これやると重複してTagTextが出てきてしまうのでダメ 
    database.ref(room_name + `/board/` + tag_name.value).update({
        tag_name: tag_name.value
    });
    */

    database.ref(room_name + `/board/` + tag_name.value + '/text_list').push({
        user_name: user_name,
        text: tag_text.value
    });
    console.log("writing database");
}

function create_tag() {
    //タグ作成のときの書き込み
    tag_create_text = document.getElementById("tag_create_text");
    database.ref(room_name + `/board/` + tag_create_text.value).update({
        tag_name: tag_create_text.value
    });
    console.log("Create New Tag");
    tag_create_text.value = "";
}

function read_tag_list_for_tag_select() {
    //タグ選択するときに表示するためのタグ一覧読み込み
    database.ref(room_name + `/board`).on('value', function(data) {
        delete_tag_list_at_HTML();
        const tag_list_obj = data.val();
        for (key in tag_list_obj) {
            push_tag_list_at_HTML(key);
        }
    });
}

function delete_tag_list_at_HTML() {
    //タグ一覧を一旦削除
    tag_list = document.getElementById("tag_list");
    tag_list.textContent = null
}

function push_tag_list_at_HTML(push_tag_name) {
    //HTMLでタグ名の一覧を表示させる
    tag_list = document.getElementById("tag_list");
    tag_list.insertAdjacentHTML('beforeend', '<option value="' + push_tag_name + '">');
}

function read_user_list() {
    //ユーザ一覧読み込み
    database.ref(room_name + `/user_list`).on('value', function(data) {
        delete_user_list_at_HTML();
        const user_list_obj = data.val();
        for (key in user_list_obj) {
            push_user_list_at_HTML(key);
        }
    });
}

function delete_user_list_at_HTML() {
    //他の人が入室してきたときに対応するためにHTMLのユーザ一覧を一旦削除
    name_list = document.getElementById("name_list");
    name_list.textContent = null
}

function push_user_list_at_HTML(push_user_name) {
    //HTMLでユーザ名の一覧を表示させる
    name_list = document.getElementById("name_list");
    name_list.insertAdjacentHTML('beforeend', '<div class="user_list">' + push_user_name + '</div>');
}

function read_tag_for_display() {
    //タグ一覧読み込み
    board = document.getElementById("board");
    database.ref(room_name + `/board`).on('value', function(data) {
        delete_board();
        const tag_list_obj = data.val();
        for (key in tag_list_obj) {
            display_tag(key);
            read_text_list_for_display(key);
        }
    });
}

function delete_board() {
    //HTMLのboardのタグを一旦削除
    board.textContent = null
}

function display_tag(push_tag_name) {
    //HTMLのboardにタグを表示させる
    const display_text = '<div class="tag" id ="' + push_tag_name + '"><div class="tag_name">TagName:' + push_tag_name + '</div></div>'
    board.insertAdjacentHTML('beforeend', display_text);
}

function read_text_list_for_display(tag) {
    //テキスト一覧読み込み
    database.ref(room_name + `/board/` + tag + '/text_list').once('value').then(function(data) {
        const text_list_obj = data.val();
        for (key in text_list_obj) {
            read_text(tag, key)
        }
    });
}

// function delete_text(tag) {
//     //HTMLのboardのタグを一旦削除
//     const tag_text_class = document.getElementsByClassName("tag_text_class")
//     tag_text_class.textContent = null;
// }

function read_text(tag, text_key) {
    //テキスト個別読み込み
    database.ref(room_name + `/board/` + tag + '/text_list/' + text_key).once('value').then(function(data) {
        const text = data.val().text;
        display_tag_text(tag, text);
    });
}

function display_tag_text(tag, push_tag_text) {
    //HTMLのboardのタグの中にテキストを表示させる
    const target = document.getElementById(tag);
    const display_text = '<div class="tag_text">　　TagText:' + push_tag_text + '</div>'
    target.insertAdjacentHTML('beforeend', display_text);
}