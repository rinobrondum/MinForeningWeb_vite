import { loginExternal } from "authentication/sagas";
import getAppUrls from 'jsonFetches/getAppUrls'
// import { PublicClientApplication } from "@azure/msal-browser";
// import "./msal-browser.min.js";


// export const auth = () => {
    // Browser check variables
    // If you support IE, our recommendation is that you sign-in using Redirect APIs
    // If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf("MSIE ");
    const msie11 = ua.indexOf("Trident/");
    const msedge = ua.indexOf("Edge/");
    const isIE = msie > 0 || msie11 > 0;
    const isEdge = msedge > 0;
    
    // Add here scopes for id token to be used at MS Identity Platform endpoints.
    const loginRequest = {
        scopes: ["User.Read"]
    };

    // Add here the endpoints for MS Graph API services you would like to use.
    const graphConfig = {
        graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
        graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
    };

    // Add here scopes for access token to be used at MS Graph API endpoints.
    const tokenRequest = {
        scopes: ["Mail.Read"],
        forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
    };

    const silentRequest = {
        scopes: ["openid", "profile", "User.Read", "Mail.Read"]
    };

    let signInType;
    let accountId = "";
    var myMSALObj = {};

    function handleResponse(resp) {
        if (resp !== null) {
            accountId = resp.account.homeAccountId;
            myMSALObj.setActiveAccount(resp.account);

            const accessTokenRequest = {
                scopes: ["user.read"],
                account: resp.account,
            };

            myMSALObj
                .acquireTokenSilent(accessTokenRequest)
                .then(function (accessTokenResponse) {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;

                    // Call your API with token
                    fetch(`${getAppUrls().apiMyOrgUrl}/v4/login/external`, {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Basic " + btoa("minforeningwebuser:ZxDjmeQrwpqYd2zDxIHLShu3wrnptz")
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                          },
                        body: JSON.stringify({
                            provider: 'Microsoft',
                            token: accessToken
                        }), // body data type must match "Content-Type" header
                      }).then(response => {
                            let json = response.json().then(result => {
                                result.token = result.authToken;
                                localStorage.setItem('mf-user', JSON.stringify(result))
                                setTimeout(function() {
                                    window.location.reload(true);
                                }, 500);
                            });
                          
                      });

                })
        } else {
            // need to call getAccount here?
            const currentAccounts = myMSALObj.getAllAccounts();
            if (!currentAccounts || currentAccounts.length < 1) {
                return;
            } else if (currentAccounts.length > 1) {

            } else if (currentAccounts.length === 1) {
                const activeAccount = currentAccounts[0];
                myMSALObj.setActiveAccount(activeAccount);
                accountId = activeAccount.homeAccountId;
                
            }
        }
    }

    async function signIn(method) {
        signInType = isIE ? "redirect" : method;
        if (signInType === "popup") {
            return myMSALObj.loginPopup({
                ...loginRequest,
                redirectUri: "/redirect"
            }).then(handleResponse).catch(function (error) {
                console.log(error);
            });
        } else if (signInType === "redirect") {
            return myMSALObj.loginRedirect(loginRequest)
        }
    }

    function signOut(interactionType) {
        const logoutRequest = {
            account: myMSALObj.getAccountByHomeId(accountId)
        };

        if (interactionType === "popup") {
            myMSALObj.logoutPopup(logoutRequest).then(() => {
                window.location.reload();
            });
        } else {
            myMSALObj.logoutRedirect(logoutRequest);
        }
    }

    async function getTokenPopup(request, account) {
        request.redirectUri = "/redirect"
        return await myMSALObj
            .acquireTokenSilent(request)
            .catch(async (error) => {
                console.log("silent token acquisition fails.");
                if (error instanceof msal.InteractionRequiredAuthError) {
                    console.log("acquiring token using popup");
                    return myMSALObj.acquireTokenPopup(request).catch((error) => {
                        console.error(error);
                    });
                } else {
                    console.error(error);
                }
            });
    }

    // This function can be removed if you do not need to support IE
    async function getTokenRedirect(request, account) {
        return await myMSALObj.acquireTokenSilent(request).catch(async (error) => {
            console.log("silent token acquisition fails.");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                console.log("acquiring token using redirect");
                myMSALObj.acquireTokenRedirect(request);
            } else {
                console.error(error);
            }
        });
    }
// }

export async function readyAuth(msalConfig) {
    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    myMSALObj = new msal.PublicClientApplication(msalConfig);

    myMSALObj.initialize().then(() => {
        // Redirect: once login is successful and redirects with tokens, call Graph API
        myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
            console.error(err);
        });
    })
}

export async function signInAuth() {        
    signIn("redirect");
}