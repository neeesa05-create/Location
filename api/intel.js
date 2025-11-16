const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone,isp,query`);
        const geoData = await response.json();

        if (geoData.status === 'fail') {
            return res.status(200).json({ ipAddress: ip, error: 'IP details fetch failed' });
        }
        
        const intel = {
            ipAddress: geoData.query,
            city: geoData.city,
            region: geoData.regionName,
            country: geoData.countryCode,
            latitude: geoData.lat ? geoData.lat.toString() : 'N/A',
            longitude: geoData.lon ? geoData.lon.toString() : 'N/A',
            isp: geoData.isp,
            timezone: geoData.timezone,
        };

        res.status(200).json(intel);
    } catch (error) {
        res.status(500).json({ ipAddress: ip, error: 'Server error during IP lookup' });
    }
};
