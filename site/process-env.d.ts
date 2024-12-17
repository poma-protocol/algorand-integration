declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            ALGORAND_SERVER: string,
            ALGORAND_SERVER_PORT: number,
            MNEMONIC: string,
            APP_ID: string

        }
    }
}

export {}