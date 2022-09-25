import dotenv from 'dotenv';
dotenv.config();

const BACKEND_DOMAIN = process.env.REACT_APP_BACKEND_DOMAIN;

export { BACKEND_DOMAIN };