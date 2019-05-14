export const errorFunction = (error, updateErrorMessage) => {

    if (error.response.status === 400) {
        //Bad input parameter. The response body is a plaintext message with more information.
        updateErrorMessage("Something went wrong with the call to the server. Please try again.")
    } 
    else if (error.response.status === 401) {
        //Bad or expired token. This can happen if the access token is expired or if the access token has been revoked by Dropbox or the user. To fix this, you should re-authenticate the user. The Content-Type of the response is JSON of typeAuthError
        updateErrorMessage("Something went wrong with your account. Log in again to get a new session.")
    }
    else if (error.response.status === 403) {
        //The user or team account doesn't have access to the endpoint or feature. The Content-Type of the response is JSON of typeAccessError
        updateErrorMessage("Something went wrong with your account. Log in again to get a new session.")
    }
    else if (error.response.status === 404) {
        //File or folder not found at the specified path.
        updateErrorMessage("The server couldn´t find your request. Page not found. Please try again.")
    }
    else if (error.response.status === 409) {
        //File or folder not found at the specified path.
        updateErrorMessage("The path your trying to reach is not exists. Please try again.")
    }
    else if (error.response.status === 429) {
        //Your app is making too many requests for the given user or team and is being rate limited. Your app should wait for the number of seconds specified in the "Retry-After" response header before trying again.The Content-Type of the response can be JSON or plaintext. If it is JSON, it will be typeRateLimitErrorYou can find more information in the data ingress guide.
        updateErrorMessage("Too many request to the server.")
    }
    else if (error.response.status > 499 && error.response.status < 600 ) {
        //An error occurred on the Dropbox servers. Check status.dropbox.com for announcements about Dropbox service issues.
        updateErrorMessage("Something went wrong with the Dropboxserver. Please try again in a couple of minutes.")
    }
    else {
        updateErrorMessage("Something went wrong. Please try again.")
    }
}
