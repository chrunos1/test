const baseUrl = 'https://www.qobuz.com/api.json/0.2/';
const token = 'yn-HVbPSnrnLazYtBbhTNCHpny-JcyE5LqrHkJnLiv047BJO2SxS_lmDVVN6UnqLv4EvA_5F-lHGY56hIgpfJg';
const appId = '579939560';
const customHeaders = {
    'X-App-Id': '579939560',
    'X-User-Auth-Token': 'yn-HVbPSnrnLazYtBbhTNCHpny-JcyE5LqrHkJnLiv047BJO2SxS_lmDVVN6UnqLv4EvA_5F-lHGY56hIgpfJg',
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.21) Gecko/20100312 Firefox/3.6'
};
const searchInput = document.getElementById('searchInput');
const resultList = document.getElementById('resultList');
const message = document.getElementById('message');

async function fetchResults(input) {
    resultList.innerHTML = '';
    message.style.display = 'block';
    message.textContent = 'Fetching results...';

            try {
                // Add your fetch logic here
                let searchUrl = `${baseUrl}catalog/search?query=${input}&offset=0&limit=10`;
                const response = await fetch(searchUrl, { headers: customHeaders });
                if (!response.ok) throw new Error('Failed to get results');
                const tracks = (await response.json()).tracks.items;
                if (Array.isArray(tracks) && tracks.length > 0) {
                    message.style.display = 'none';
                    
                    // Extract only 'id' and 'title' from each item
                    const results = tracks.map(item => ({
                        url: `https://open.qobuz.com/track/${item.id}`,
                        title: `${item.title} by ${item.performer.name}`
                    }));
                    console.log(results);
        
                    // Display the results
                    displayResults(results);
                } else {
                    message.textContent = 'No results found.';
                }
            
            
                console.log('Fetching results for:', input);
                // Simulate response data
                

                message.style.display = 'none';
                displayResults(results);
            } catch (error) {
                message.style.display = 'block';
                message.textContent = 'Error fetching results.';
            }
        }

        async function fetchDataForURL(url) {
            message.style.display = 'block';
            message.textContent = `Fetching data for: ${url}`;
            const trackIdMatch = url.match(/\d+$/);
            if (!trackIdMatch) throw new Error('Track ID not found in your input');
            const trackId = trackIdMatch[0];

            const timestamp = Math.floor(Date.now() / 1000);
            const rSigRaw = `trackgetFileUrlformat_id27intentstreamtrack_id${trackId}${timestamp}fa31fc13e7a28e7d70bb61e91aa9e178`;
            const rSig = md5(rSigRaw);
            const downloadUrl = `https://www.qobuz.com/api.json/0.2/track/getFileUrl?format_id=27&intent=stream&track_id=${trackId}&request_ts=${timestamp}&request_sig=${rSig}`;
            const customHeaders = {
                'X-App-Id': appId,
                'X-User-Auth-Token': token,
                'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.21) Gecko/20100312 Firefox/3.6'
            };

            try {
                // Add your fetch logic here
                const downloadResponse = await fetch(downloadUrl, { headers: customHeaders });
                const fileUrl = (await downloadResponse.json()).url;
                // Simulate response handling
                
                message.style.display = 'none';
                message.textContent = `Data fetched for: ${url}`;
                console.log(fileUrl);
                const downloadButton = `<a id="download-button" href="${fileUrl}" target="_blank"><button>Download Track</button></a>`;
                document.querySelector('.download-button').innerHTML = downloadButton;
                message.textContent = 'Download link generated successfully.';
            } catch (error) {
                message.style.display = 'block';
                message.textContent = 'Error fetching data for the URL.';
            }
        }

        function displayResults(results) {
            results.forEach(result => {
                const li = document.createElement('li');
                li.textContent = result.title;
                li.dataset.url = result.url;
                li.addEventListener('click', () => fetchDataForURL(result.url));
                resultList.appendChild(li);
            });
        }

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter' && searchInput.value.trim() !== '') {
                const input = searchInput.value.trim();
                resultList.innerHTML = '';

                if (input.startsWith('http://') || input.startsWith('https://')) {
                    fetchDataForURL(input);
                } else {
                    fetchResults(input);
                }
            }
        });
        // Event listener for the search button
        searchButton.addEventListener('click', () => {
            resultList.innerHTML = '';
            const input = searchInput.value.trim();
            if (input.startsWith('http://') || input.startsWith('https://')) {
                fetchDataForURL(input);
            } else {
                fetchResults(input);
            }
        });

        function md5(string) {
            // Function to create MD5 hash
            return CryptoJS.MD5(string).toString();
        }
        
