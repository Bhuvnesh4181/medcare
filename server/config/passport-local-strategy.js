const authHandler = require("passport");
const { Strategy: CredentialStrategy } = require("passport-local");
const encoder = require("bcrypt");
const dataStore = require("../config/db.js");

// Credential-based account verification
authHandler.use(
    new CredentialStrategy(
        { usernameField: "email" },
        async (email, password, complete) => {
            try {
                // Retrieve account information
                const account = await dataStore.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [email]
                );
                
                if (!account) {
                    return complete(null, false, { message: "Incorrect email." });
                }
                
                // Validate credentials
                const credentialsValid = await encoder.compare(password, account.password);
                if (!credentialsValid) {
                    return complete(null, false, { message: "Incorrect password." });
                }
                
                return complete(null, account);
            } catch (failure) {
                console.error("⚠️ Verification Error:", failure);
                return complete(failure);
            }
        }
    )
);

// Persist account identifier to session
authHandler.serializeUser((account, complete) => complete(null, account.user_id));

// Retrieve full account details from identifier
authHandler.deserializeUser(async (identifier, complete) => {
    try {
        const account = await dataStore.oneOrNone("SELECT * FROM users WHERE user_id = $1", [identifier]);
        complete(null, account);
    } catch (failure) {
        console.error("⚠️ Account retrieval error:", failure);
        complete(failure);
    }
});

// Session validation middleware
authHandler.checkAuthentication = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }
    return response.redirect("https://localhost:3000/login");
};

module.exports = authHandler;