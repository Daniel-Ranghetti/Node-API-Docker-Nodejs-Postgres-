// app/config/db.config.js
export default {
    HOST: "node_db",
    USER: "daniel",
    PASSWORD: "12345",
    DB: "node_live_db",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};