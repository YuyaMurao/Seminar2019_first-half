/*
    1.ルームを新規作成するプログラム
    ルーム名が重複していると新規作成できないようにしている

    2.ルームに入室するプログラム

    統合版
*/
let input_user_name, input_room_name, input_password, error_msg, read_room_name, read_password;
const create_new_room_button = document.getElementById("CreateNewRoom_button");
const join_room_button = document.getElementById("JoinRoom_button");
const database = firebase.database();
const URL = "../html/room.html";

//メイン
create_new_room_button.addEventListener('click', function() {
    //新規作成
    get_element();

    if (input_user_name === "" || input_room_name === "" || input_password === "") {
        error_msg.textContent = "いずれも入力が必須です";
    } else {
        read_database_for_create();
    }

    function read_database_for_create() {
        //読み込み
        database.ref(input_room_name).once('value').then(function(data) {
            try {
                //データベース上に名前がない場合(重複がない場合)はnullのエラーが出るのでcatchへ
                read_room_name = data.val().room_name;

                //重複している場合
                error_msg.textContent = "ルーム名が重複しています";

            } catch (error) {
                //重複がないので書き込み処理
                write_database();
                move_room();
            }
        });
    }
});


join_room_button.addEventListener('click', function() {
    //入室
    get_element();

    if (input_user_name === "" || input_room_name === "" || input_password === "") {
        error_msg.textContent = "いずれも入力が必須です";
    } else {
        read_database_for_join();
    }

    function read_database_for_join() {
        //読み込み
        database.ref(input_room_name).once('value').then(function(data) {
            try {
                //データベース上にデータがない場合はnullのエラーが出るのでcatchへ
                read_room_name = data.val().room_name;
                read_password = data.val().password;

                if (input_password === read_password) {
                    move_room()
                } else {
                    error_msg.textContent = "パスワードが違います";
                }
            } catch (error) {
                error_msg.textContent = "ルームが見つかりませんでした";
            }
        });
    }
});


//サブ


function room() {
    //入室した後
    database.ref(read_room_name).once('value').then(function(data) {
        read_room_name = data.val().room_name;

    });
}

function get_element() {
    //実行したときの要素を入手
    input_user_name = document.getElementById("user_name").value;
    input_room_name = document.getElementById("room_name").value;
    input_password = document.getElementById("room_password").value;
    error_msg = document.getElementById("error_msg");
    error_msg.textContent = "";
}


function write_database() {
    //書き込み
    database.ref(input_room_name).set({
        room_name: input_room_name,
        password: input_password,
        board: "",
    });

    console.log("writing database");
}

function move_room() {
    //ページ遷移(入室)
    const form = document.getElementById("form");
    form.method = "POST";
    form.action = "html/room.html";
    form.submit();
}