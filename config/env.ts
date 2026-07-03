import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}. Copy .env.example to .env.`);
    }
    return value;
}

export const ENV = {
    baseURL: required("BASE_URL"),
    standardUser: required("STANDARD_USER"),
    standardPassword: required("STANDARD_PASSWORD"),
};
