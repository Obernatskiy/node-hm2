module.exports = {
    MONGO_URL:process.env.MONGO_URL || 'mongodb://localhost:27017/test/default-mar-db',

    ACCESS_SECRET_WORD: process.env.ACCESS_SECRET_WORD || 'ACCESS_WORD',
    REFRESH_SECRET_WORD: process.env.REFRESH_SECRET_WORD || 'REFRESH_WORD',
}