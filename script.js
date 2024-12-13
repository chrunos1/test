async function download() {
    const trackUrl = document.getElementById('track-url').value;
    const result = document.getElementById('result');
    console.log(trackUrl);

    if ( !trackUrl) {
        result.innerHTML = 'Please enter Track URL.';
        return;
    }

    try {
        let API = 'https://tidal.401658.xyz/track/?id=';

        const trackId = trackUrl.match(/track\/(\d{8,10})/)[1];
        const apiUrl = `${API}${trackId}&quality=LOSSLESS`;
        console.log(apiUrl);

        const trackResponse = await fetch(apiUrl, {
            method: 'GET',
            
            headers: {
                Accept: '*/*'

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
