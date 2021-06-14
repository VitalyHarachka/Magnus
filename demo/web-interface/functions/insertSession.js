module.exports = function (app, database, email, jwtToken) {
    database.collection('users').update({
            "email": email
        }, {
            $set: {
                "sSession": jwtToken
            }
        },
        function (err, object) {
            if (err) {
                return false
            } else {
                return true
            }
        }
    );
}