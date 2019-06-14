const Peer = window.Peer;
let videoid;

(async function main() {
    const localVideo = document.getElementById('js-local-stream');
    const joinTrigger = document.getElementById('js-join-trigger');
    const endcall = document.getElementById('end-call');
    const remoteVideos = document.getElementById('js-remote-streams');
    const roomId = document.getElementById('js-room-id');
    const remove_room = document.getElementById('remove_room');
    let isDelete;
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



        // for closing room members
        room.on('peerLeave', peerId => {
            const remoteVideo = remoteVideos.querySelector(
                `[data-peer-id=${peerId}]`
            );
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
            remoteVideo.srcObject = null;
            remoteVideo.remove();
        });

        // for closing myself
        room.once('close', () => {
            Array.from(remoteVideos.children).forEach(remoteVideo => {
                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
                remoteVideo.srcObject = null;
                remoteVideo.remove();
            });
        });


        endcall.addEventListener('click', function() {
            location.reload();
        })
        remove_room.addEventListener('click', function() {
            isDelete = window.confirm("WARNING!!!\nAll comments in this room will be deleted from the database!");
            if (isDelete) {
                newPostRef.ref(room.name).remove();
                location.reload();
            }
        })



    });


    peer.on('error', console.error);
})();

function click_video(el) {
    el.classList.toggle('zoom');
}