const database = firebase.database();
let user_name, room_name, title, exit_button, name_list, board, tag, tag_name, tag_list, text, send_button, error_text, tag_create_text, create_tag_button;

window.onload = function main() {
    param = GetQueryString();
    user_name = param["user_name"];
    room_name = tag_name = param["room_name"];
    write_user_name();

    title = document.getElementById("title");
    title.textContent = room_name + " Room";

    exit_button = document.getElementById("exit_button");
    exit_button.addEventListener('click', exit);

    send_button = document.getElementById("send_button");
    send_button.addEventListener('click', judge_write);

    read_user_list();
    read_text_list_for_display();
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
    // tag_name = document.getElementById("tag_name");
    text = document.getElementById("text");
    error_text_send = document.getElementById("error_text_send");
    if (text.value === "") {
        error_text_send.textContent = "入力してください";
    } else {
        write_text();
        text.value = "";
        error_text_send.textContent = "";
    }
}


function write_text() {
    //テキスト入力されたときの書き込み

    database.ref(room_name + '/board/text_list').push({
        user_name: user_name,
        text: text.value
    });
    console.log("writing database");
}



// function read_tag_list_for_tag_select() {
//     //タグ選択するときに表示するためのタグ一覧読み込み
//     database.ref(room_name + ` / board `).on('value', function(data) {
//         delete_tag_list_at_HTML();
//         const tag_list_obj = data.val();
//         for (key in tag_list_obj) {
//             push_tag_list_at_HTML(key);
//         }
//     });
// }

// function delete_tag_list_at_HTML() {
//     //タグ一覧を一旦削除
//     tag_list = document.getElementById("tag_list");
//     tag_list.textContent = null
// }

// function push_tag_list_at_HTML(push_tag_name) {
//     //HTMLでタグ名の一覧を表示させる
//     tag_list = document.getElementById("tag_list");
//     tag_list.insertAdjacentHTML('beforeend', '<option value="' + push_tag_name + '">');
// }

function read_user_list() {
    //ユーザ一覧読み込み
    database.ref(room_name + '/user_list').on('value', function(data) {
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

// function read_tag_for_display() {
//     //タグ一覧読み込み
//     board = document.getElementById("board");
//     database.ref(room_name + ` / board `).on('value', function(data) {
//         delete_board();
//         const tag_list_obj = data.val();
//         for (key in tag_list_obj) {
//             display_tag(key);
//             read_text_list_for_display(key);
//         }
//     });
// }

function delete_board() {
    //HTMLのboardのタグを一旦削除
    board.textContent = null
}

function display_tag(push_tag_name) {
    //HTMLのboardにタグを表示させる
    const display_text = '<div class="tag card text-white bg-info mb-3" id ="' + push_tag_name + '><div class="card-body"><div class="tag_name card-header">' + push_tag_name + '</div><div class="scroll card-text" id ="scroll_' + push_tag_name + '"></div></div></div>'
    board.insertAdjacentHTML('beforeend', display_text);
}

// function read_text_list_for_display() {
//     //テキスト一覧読み込み
//     board = document.getElementById("board");
//     database.ref(room_name + '/board/text_list').once('value').then(function(data) {
//         const text_list_obj = data.val();
//         for (key in text_list_obj) {
//             read_text(key)
//         }
//     });
// }

function read_text_list_for_display() {
    //テキスト一覧読み込み
    board = document.getElementById("board");
    database.ref(room_name + '/board/text_list').on('value', function(data) {
        delete_board();
        const text_list_obj = data.val();
        for (key in text_list_obj) {
            read_text(key)
        }
    });
}

function read_text(text_key) {
    //テキスト個別読み込み
    database.ref(room_name + '/board/text_list/' + text_key).once('value').then(function(data) {
        const text = data.val().text;
        const name = data.val().user_name;
        display_tag_text(text, name, text_key);
    });
}

function display_tag_text(push_tag_text, push_name, text_key) {
    //HTMLのboardにテキストと発言した人を表示させる
    const display_text = '<div class="tag card text-white bg-info mb-3" id ="' + text_key + '><div class="card-body"><div class="scroll card-text" id="card_text"><div class="tag_text">' + push_tag_text + '(' + push_name + ')</div></div></div><div>';
    board.insertAdjacentHTML('beforeend', display_text);
}


// function display_tag_select(tag) {
//     tag_name = document.getElementById("tag_name");
//     tag_name.value = tag.id;
// }

function GetQueryString() {
    if (1 < document.location.search.length) {
        // 最初の1文字 (?記号) を除いた文字列を取得する
        var query = document.location.search.substring(1);

        // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split('&');

        var result = new Object();
        for (var i = 0; i < parameters.length; i++) {
            // パラメータ名とパラメータ値に分割する
            var element = parameters[i].split('=');

            var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);

            // パラメータ名をキーとして連想配列に追加する
            result[paramName] = decodeURIComponent(paramValue);
        }
        return result;
    }
    return null;
}