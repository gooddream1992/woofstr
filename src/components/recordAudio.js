import { v4 as uuid } from 'uuid';

export default function recordAudio() {
  return new Promise((resolve) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = {
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus',
      };
      const mediaRecorder = new MediaRecorder(stream, options);
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      function start() {
        mediaRecorder.start();
      }

      function stop() {
        return new Promise((resolve) => {
          mediaRecorder.addEventListener('stop', () => {
            const audioName = uuid();
            const audioFile = new File(audioChunks, audioName, {
              type: 'audio/mpeg',
            });
            const audioURL = URL.createObjectURL(audioFile);
            const audio = new Audio(audioURL);
            function play() {
              audio.play();
            }

            resolve({ audioFile, audioURL, play, audioName });
          });
          mediaRecorder.stop();
        });
      }
      resolve({ start, stop });
    });
  });
}
