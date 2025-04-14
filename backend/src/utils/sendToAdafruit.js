import axios from 'axios';

async function sendDataToFeed(feedKey, value) {
    const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
    const AIO_KEY = process.env.ADAFRUIT_IO_KEY;
    const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedKey}/data`;
    console.log(`Sending "${data}" to Adafruit IO feed: ${feedKey}`);
    try {
        const response = await axios.post(url, {
            value: value,
        }, {
            headers: {
                'X-AIO-Key': AIO_KEY,
                'Content-Type': 'application/json',
            },
        })
        console.log('Data sent successfully:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending data to Adafruit IO (in utils/sendToAdafruit.js):', error.response ? error.response.data : error.message);
        throw error;
    }
}

export default sendDataToFeed;