const environment = process.env.NODE_ENV || 'production';

const urls = {
    production: [
        'https://www.fedex.com/lite/lite-ship.html?locale=en_nl&cntry_code=nl_english#address',
        'https://www.fedex.com/en-nl/online/rating.html#',
        'https://www.fedex.com/en-nl/shipping/schedule-pickup.html#form',
        'https://www.fedex.com/en-nl/shipping/industry-solutions/ecommerce.html',
        'https://www.fedex.com/',
    ]
};

module.exports = urls[environment] || urls.production;