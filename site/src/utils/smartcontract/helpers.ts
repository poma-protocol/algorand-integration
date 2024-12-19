export function isLowFundsErr(err: unknown): boolean {
    if (err instanceof Error) {
        const lowFundsReg = new RegExp("transaction\.*account\.*balance\.*below\.*min");
        return lowFundsReg.test(err.message);
    } else {
        return false;
    }
}