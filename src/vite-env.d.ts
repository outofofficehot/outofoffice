/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS?: string;
  readonly VITE_AZTEC_PXE_URL?: string;
  readonly VITE_LINKEDIN_CLIENT_ID?: string;
  readonly VITE_LINKEDIN_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
