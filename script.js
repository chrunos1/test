document.getElementById('download-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const clipboardText = document.getElementById('clipboard-text').value;
    const statusElement = document.getElementById('status');

    statusElement.textContent = 'Processing...';

    try {
        const trackIdMatch = clipboardText.match(/\d+$/);
        if (!trackIdMatch) throw new Error('Track ID not found in clipboard text');
        const trackId = trackIdMatch[0];

        const timestamp = Math.floor(Date.now() / 1000);
        const rSigRaw = `trackgetFileUrlformat_id27intentstreamtrack_id${trackId}${timestamp}fa31fc13e7a28e7d70bb61e91aa9e178`;
        const rSig = md5(rSigRaw);
        console.log(rSig);

        const downloadUrl = `https://www.qobuz.com/api.json/0.2/track/getFileUrl?format_id=27&intent=stream&track_id=${trackId}&request_ts=${timestamp}&request_sig=${rSig}`;
        const customHeaders = {
            'X-App-Id': '579939560',
            'X-User-Auth-Token': 'yn-HVbPSnrnLazYtBbhTNCHpny-JcyE5LqrHkJnLiv047BJO2SxS_lmDVVN6UnqLv4EvA_5F-lHGY56hIgpfJg',
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.21) Gecko/20100312 Firefox/3.6'
        };

        const downloadResponse = await fetch(downloadUrl, { headers: customHeaders });
        if (!downloadResponse.ok) throw new Error('Failed to get download URL');
        const fileUrl = (await downloadResponse.json()).url;
        console.log(fileUrl);
        const downloadButton = `<a id="my-button" href="${fileUrl}" target="_blank"><button>Download Track</button></a>`;
        
        // Assuming there's an element with class 'download-button' to hold the button
        document.querySelector('.download-button').innerHTML = downloadButton;
        statusElement.textContent = 'Download link generated successfully.';
    } catch (error) {
        statusElement.textContent = `Error: ${error.message}`;
    }
});

function md5(string) {
    // Function to create MD5 hash
    return CryptoJS.MD5(string).toString();
}
