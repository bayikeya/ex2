let watchId;
let alerted = false;

// ◆各地点で表示する画像を記入 ※スタート地点、スポット１、スポット２・・・
// 画像は280x280 JPG 推奨
const imagePaths = [
    './huyuka1.jpg',
    './huyuka2.jpg'
];

const imageElement = document.getElementById('myImage');

// 画像をプリロード
function preloadImages() {
    for (let i = 0; i < imagePaths.length; i++) {
      const img = new Image();
      img.src = imagePaths[i];
    }
}

// ◆各スポットの緯度経度を記入 ※スポット１、スポット２・・・
// 緯度経度はGoogleマップで右クリックでコピーする
const targetSpots = [
    { latitude: 35.83850196145268, longitude: 139.58594834578963 },
    { latitude: 35.83827730992454, longitude: 139.5860521973704 }
];


let currentSpotIndex = 0;
const targetRadius = 20;

// MP3再生関数
function playAudio(audioFile) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioFile;
    audioPlayer.play();
}

// BGM再生
    const bgm = document.getElementById('bgm');

function startBGM() {
    bgm0000.play();
}

function stopBGM() {
    bgm0000.pause();
    bgm0000.currentTime = 0;  // 停止したら再生位置をリセット
}


// ツアー開始
function startTour() {
    const startButton = document.getElementById('startTour');
    const stopButton = document.getElementById('stopTour');
    const stopbgmBTN = document.getElementById('stopbgmBTN');

//オープニングメッセージ

//◆オープニングに表示させたい注意事項を記入
    alert('歩きスマホはしないで下さい');

    startBGM();
    playAudio(`00.mp3`);

    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
    stopbgmBTN.style.display = 'none';

    const messageIndex = currentSpotIndex;
    const message = spotMessages[messageIndex];
    messText.innerText = message;

    const mapIndex = currentSpotIndex;
    const maplink = mapUrl[mapIndex];
    const map = mapName[mapIndex];
    statusText.innerText = map;
    statusText.href = maplink;

    imageElement.src = imagePaths[currentSpotIndex];


// メインルーチン（ループ）
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const currentSpot = targetSpots[currentSpotIndex];
            const distance = calculateDistance(latitude, longitude, currentSpot.latitude, currentSpot.longitude);

            const targetCoordinates = `目標緯度: ${currentSpot.latitude.toFixed(6)},目標経度: ${currentSpot.longitude.toFixed(6)}\n`;

            const currentCoordinates = `緯度: ${latitude.toFixed(6)},経度: ${longitude.toFixed(6)},\n [残り: ${distance.toFixed(2)} メートル]\n`;

            coordinatesText.innerText = `${currentCoordinates}`;

// エリア侵入
            if (distance <= targetRadius && !alerted) {

                const messageIndex = currentSpotIndex;
                const message = spotMessages[messageIndex +1 ];
                messText.innerText = message;

                const mapIndex = currentSpotIndex;
                const maplink = mapUrl[mapIndex +1 ];
                const map = mapName[mapIndex +1 ];
                statusText.innerText = map;
                statusText.href = maplink;

                playAudio(`0${messageIndex + 1}.mp3`);
                imageElement.src = imagePaths[currentSpotIndex +1 ];

                alerted = true;

                // 次の目標の緯度経度を表示
                const nextSpot = targetSpots[currentSpotIndex + 1];
                const nextTargetCoordinates = `次の目標緯度: ${nextSpot.latitude.toFixed(6)}, 次の目標経度: ${nextSpot.longitude.toFixed(6)}`;
                //coordinatesText.innerText += `${nextTargetCoordinates}`;

            }

// 終了判定
            if (distance <= targetRadius) {
                currentSpotIndex++;
                alerted = false;
                if (currentSpotIndex >= targetSpots.length) {
                    stopTour();
                }
            }
        },
        (error) => {
            console.error('位置情報の取得に失敗しました。', error);
        },
        { enableHighAccuracy: true }
    );
}

// ツアー終了
function stopTour() {
    const startButton = document.getElementById('startTour');
    const stopButton = document.getElementById('stopTour');
    const stopbgmBTN = document.getElementById('stopbgmBTN');

    startButton.style.display = 'none';
    stopButton.style.display = 'none';
    stopbgmBTN.style.display = 'inline';

//◆ 画像下にも終了メッセージを記入
    coordinatesText.innerText = 'ツアーを終了です！お疲れ様でした。';

    navigator.geolocation.clearWatch(watchId);
    alerted = false;
    currentSpotIndex = 0;
}


// 緯度経度計算
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
};

AFRAME.registerComponent("rotation-reader", {
    tick: function () {
      const cameraRotation = this.el.object3D.rotation;
      // カメラの回転情報を利用した処理
    },
  });
