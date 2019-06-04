const Peer = window.Peer;
let videoid;

(async function main() {
    const localVideo = document.getElementById('js-local-stream');
    const joinTrigger = document.getElementById('js-join-trigger');
    const leaveTrigger = document.getElementById('js-leave-trigger');
    const remote_mainVideo = document.getElementById('js-main-remote-streams');
    const remoteVideos = document.getElementById('js-remote-streams');
    const roomId = document.getElementById('js-room-id');
    const localText = document.getElementById('js-local-text');
    const sendTrigger = document.getElementById('js-send-trigger');
    const messages = document.getElementById('js-messages');
    let videoclass;


    const localStream = await navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: true,
        })
        .catch(console.error);

    // Render local stream
    localVideo.muted = true;
    localVideo.srcObject = localStream;
    await localVideo.play().catch(console.error);

    const peer = new Peer({
        key: '10f9c904-ebf1-4840-b783-2ac06b39c7cb',
        debug: 3,
    });

    // Register join handler
    joinTrigger.addEventListener('click', () => {
        // Note that you need to ensure the peer has connected to signaling server
        // before using methods of peer instance.
        if (!peer.open) {
            return;
        }

        const room = peer.joinRoom(roomId.value, {
            mode: location.hash === '#sfu' ? 'sfu' : 'mesh',
            stream: localStream,
        });

        room.once('open', () => {
            messages.textContent += '=== You joined ===\n';

        });
        room.on('peerJoin', peerId => {
            messages.textContent += `=== ${peerId} joined ===\n`;
        });

        // Render remote stream for new peer join in the room
        room.on('stream', async stream => {
            const newVideo = document.createElement('video');
            newVideo.srcObject = stream;
            // mark peerId to find it later at peerLeave event
            newVideo.setAttribute('data-peer-id', stream.peerId);
            newVideo.setAttribute('id', stream.peerId);
            newVideo.setAttribute('class', 'video');
            newVideo.setAttribute('onclick', 'click_video(this)');
            remoteVideos.append(newVideo);
            await newVideo.play().catch(console.error);
        });

        room.on('data', ({ data, src }) => {
            // Show a message sent to the room and who sent
            messages.textContent += `${src}: ${data}\n`;
        });

        // for closing room members
        room.on('peerLeave', peerId => {
            const remoteVideo = remoteVideos.querySelector(
                `[data-peer-id=${peerId}]`
            );
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
            remoteVideo.srcObject = null;
            remoteVideo.remove();

            messages.textContent += `=== ${peerId} left ===\n`;
        });

        // for closing myself
        room.once('close', () => {
            sendTrigger.removeEventListener('click', onClickSend);
            messages.textContent += '== You left ===\n';
            Array.from(remoteVideos.children).forEach(remoteVideo => {
                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
                remoteVideo.srcObject = null;
                remoteVideo.remove();
            });
        });

        sendTrigger.addEventListener('click', onClickSend);
        leaveTrigger.addEventListener('click', () => room.close(), { once: true });

        function onClickSend() {
            // Send message to all of the peers in the room via websocket
            room.send(localText.value);

            messages.textContent += `${peer.id}: ${localText.value}\n`;
            localText.value = '';
        }



        // remoteVideos.addEventListener('click', async stream => {
        //     // console.log(remoteVideos.childNodes.values);
        //     const mediaSource = new MediaSource();
        //     const Video = document.createElement('video');
        //     Video.srcObject = mediaSource;
        //     Video.setAttribute('data-peer-id', videoid);
        //     console.log(videoid);
        //     // mark peerId to find it later at peerLeave event
        //     // Video.setAttribute('data-peer-id', videoid);
        //     remote_mainVideo.append(Video);
        //     // await Video.play().catch(console.error);
        // });

        // function move_mainvideo() {
        //     // console.log(remoteVideos.childNodes.values);
        //     const Video = document.createElement('video');
        //     // Video.srcObject = stream;
        //     console.log(videoid);
        //     // mark peerId to find it later at peerLeave event
        //     Video.setAttribute('data-peer-id', videoid);
        //     remote_mainVideo.append(Video);
        //     // await Video.play().catch(console.error);
        // }



    });


    peer.on('error', console.error);
})();

function click_video(el) {
    el.classList.toggle('zoom');
}