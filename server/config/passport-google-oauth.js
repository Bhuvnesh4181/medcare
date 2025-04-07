const authStrategy = require("passport");
const { Strategy: ExternalAuthStrategy } = require("passport-google-oauth20");
const dataStore = require("./db.js");

// External authentication configuration
authStrategy.use(
    new ExternalAuthStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessCred, refreshCred, userProfile, complete) => {
            try {
                const contactEmail = userProfile.emails?.[0]?.value;
                const displayName = userProfile.displayName;
                
                if (!contactEmail) {
                    return complete(new Error("Authentication profile missing email information"), null);
                }
                
                // Verify account existence
                let account = await dataStore.oneOrNone("SELECT * FROM users WHERE user_emailid = $1", [contactEmail]);
                
                if (!account) {
                    // Create new account record
                    const insertStatement = `
                        INSERT INTO users(user_name, user_emailid, password)
                        VALUES($1, $2, $3)
                        RETURNING user_id, user_name, user_emailid;
                    `;
                    
                    const freshAccount = await dataStore.one(insertStatement, [displayName, contactEmail, "external-auth"]);
                    account = freshAccount;
                }
                
                return complete(null, account);
            } catch (failure) {
                console.error("⚠️ External Authentication Error:", failure);
                return complete(failure, null);
            }
        }
    )
);

// Store account identifier in session
authStrategy.serializeUser((account, complete) => {
    complete(null, account.user_id);
});

// Retrieve complete account from identifier
authStrategy.deserializeUser(async (identifier, complete) => {
    try {
        const account = await dataStore.oneOrNone("SELECT * FROM users WHERE user_id = $1", [identifier]);
        complete(null, account);
    } catch (failure) {
        console.error("⚠️ Account retrieval error:", failure);
        complete(failure, null);
    }
});

module.exports = authStrategy;