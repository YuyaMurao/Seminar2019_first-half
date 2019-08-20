const functions = require('firebase-functions');

exports.room = functions.https.onRequest((request, response) => {
    switch (request.method) {
        case 'GET':
            // ここにGETの処理
            break
        case 'POST':
            // ここにPOSTの処理

            break
        default:
            response.status(400).send({ error: 'Something blew up!' })
            break
    }
})