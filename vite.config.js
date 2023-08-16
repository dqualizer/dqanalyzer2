import dotenv from 'dotenv';
dotenv.config();

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default ({ mode }) => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
    return defineConfig({
        plugins: [react()],
        build: {
            outDir: 'dist/app',
        },
        define: {
            __VITE_BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL)
        },
    })

};
