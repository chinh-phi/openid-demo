"use strict";

const express = require("express");
const session = require("express-session");
const { ExpressOIDC } = require("@okta/oidc-middleware");

let app = express();

// App settings
app.set("view engine", "pug");

// App middleware
app.use("/static", express.static("static"));

app.use(session({
    cookie: { httpOnly: true },
    secret: "can you look the other way while I type this"
}));

let oidc = new ExpressOIDC({
    issuer: "https://dev-20904555.okta.com/oauth2/default",
    client_id: "0oa55dcyhh5y0Er5j5d7",
    client_secret: "Al036kdxwMV6hH_0udEzF4xbh-C00HYWyzNQbyZs",
    appBaseUrl: "http://localhost:3000",
    routes: {
        loginCallback: {
            afterCallback: "/dashboard"
        }
    },
    scope: 'openid profile'
});

// App routes
app.use(oidc.router);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/dashboard", oidc.ensureAuthenticated(), (req, res) => {
    console.log(req.userContext.userinfo);
    res.render("dashboard", { user: req.userContext.userinfo });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

oidc.on("ready", () => {
    app.listen(3000);
});

oidc.on("error", err => {
    console.error(err);
});