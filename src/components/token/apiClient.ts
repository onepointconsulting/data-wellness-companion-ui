interface JwtTokenData {
    reportUrl: string
    name: string
    email: string
}

interface JwtTokenDataExtended extends JwtTokenData {
    amount: number
}

async function processPost(reportUrl: string, method: string, data: object) {
    return fetch(`${reportUrl}/${method}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(data),
    })
}

export async function generateJwtToken(jwtTokenData: JwtTokenData) {
    const {name, email, reportUrl} = jwtTokenData
    return processPost(reportUrl, "gen_jwt_token", { name, email })
}

export async function generateJwtTokenBatch(jwtTokenData: JwtTokenDataExtended) {
    const {name, email, amount, reportUrl} = jwtTokenData
    return processPost(reportUrl, "generate_token_batch", { name, email, amount })
}