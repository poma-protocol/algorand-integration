declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            NEXT_PUBLIC_ALGORAND_SERVER: string,
            NEXT_PUBLIC_ALGORAND_SERVER_PORT: number,
            MNEMONIC: string,
            APP_ID: string

        }
    }
}

export {}