app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
async function download() {
    const trackUrl = document.getElementById('track-url').value;
    const result = document.getElementById('result');
    console.log(trackUrl);

    if ( !trackUrl) {
        result.innerHTML = 'Please enter Track URL.';
        return;
    }

    try {
        let API = 'https://corsproxy.io/?https://tidal.401658.xyz/track/?id=';

        const trackId = trackUrl.match(/track\/(\d{8,10})/)[1];
        const apiUrl = `${API}${trackId}&quality=LOSSLESS`;
        console.log(apiUrl);

        const trackResponse = await fetch(apiUrl, {
            method: 'GET',
            
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'upgrade-insecure-requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'


            }

        });
        console.log(trackResponse);
        const trackData = await trackResponse.json();

        if (trackData.error) {
            window.open('https://t.me/chrunoss', '_blank');
            return;
        }

        if (trackData[2].OriginalTrackUrl) {
            const filename = `${trackData[0].title}-${trackData[0].artist.name}.flac`;
            const downloadUrl = trackData[2].OriginalTrackUrl;

            result.innerHTML = `Download link: <a href="${downloadUrl}" download="${filename}">${filename}</a>`;
        } else {
            result.innerHTML = 'No track found.';
        }
    } catch (error) {
        result.innerHTML = `Error: ${error.message}`;
    }
}
