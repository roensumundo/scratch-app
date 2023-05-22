let localVideo;
let remoteVideo;
let muteButton;
let cameraButton;
let leaveButton;
let isMuted = false;
let isCameraOn = true;

// Media constraints for video and audio
const mediaConstraints = {
  video: true,
  audio: true
};

// Function to handle user media stream
async function getUserMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localVideo.srcObject = stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Function to toggle audio mute/unmute
function toggleMute() {
  isMuted = !isMuted;
  localVideo.srcObject.getAudioTracks()[0].enabled = !isMuted;
  muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
}

// Function to toggle camera on/off
function toggleCamera() {
  isCameraOn = !isCameraOn;
  localVideo.srcObject.getVideoTracks()[0].enabled = isCameraOn;
  cameraButton.textContent = isCameraOn ? 'Turn Off Camera' : 'Turn On Camera';
}

// Function to leave the video room
function leaveRoom() {
  const stream = localVideo.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach(track => track.stop());

  localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    //TODO: 
    // askForRating();
    
}

document.addEventListener('DOMContentLoaded', () => {
  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');
  muteButton = document.getElementById('muteButton');
  cameraButton = document.getElementById('cameraButton');
  leaveButton = document.getElementById('leaveButton');

  // Attach event listeners to buttons
  muteButton.addEventListener('click', toggleMute);
  cameraButton.addEventListener('click', toggleCamera);
  leaveButton.addEventListener('click', leaveRoom);

  // Call getUserMedia to start video streaming
  getUserMedia();
});