/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly DEV;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
