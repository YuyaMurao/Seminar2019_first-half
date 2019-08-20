<!DOCTYPE html>

<html>


<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Room</title>
    <!-- Firebase App is always required and must be first -->
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-app.js"></script>

    <!-- Add additional services that you want to use -->
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-messaging.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-functions.js"></script>
    <!-- <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> -->
    <script src="../js/firebase_config.js"></script>

    <script src="../js/room.js"></script>

</head>

<body>
    <header>
    <div id="user_name" hidden><?php echo $_POST["user_name"];?></div>
    <div id="room_name" hidden><?php echo $_POST["room_name"];?></div>
        <div id="title">
        </div>
        
        <input type="button" value="exit" id="exit_button" />
    </header>
    


    <div class="content">
        <div id="name_list_place">
            <div class="list_title">ユーザ一覧</div>
            <div id="name_list">
            </div>
        </div>
        <div id="board_place">
            <div class="list_title">ボード</div>
            <div id="board">
            </div>
        </div>

    </div>

    <div class="send">
        <div id="tag_send">
            <input type="search" id="tag_name" name="q" autocomplete="off" placeholder="TagName" list="tag_list">
            <datalist id="tag_list"></datalist>
            <input type="text" id="tag_text" placeholder="TagText" />
            <input type="button" value="Send" id="send_button" />
        </div>
        <div id="error_text"></div>
        <div id="tag_name_send">
            CreateTag
            <input type="text" id="tag_create_text" placeholder="TagName" />
            <input type="button" value="Create" id="create_tag_button" />
        </div>

    </div>
</body>

</html>