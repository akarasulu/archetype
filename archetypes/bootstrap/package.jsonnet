local settings = import "personal-settings.jsonnet"; 
local parent = import "../base/package.jsonnet";

function (name, main="src/index.html", author="unknown", description="unknown") {} + parent(name, main, author, description) +  {
    archetype: "bootstrap",
    dependencies: {
        "@fortawesome/fontawesome-free": "^5.7.2",
        "bootstrap": "^4.3.1",
        "jquery": "^3.3.1",
        "popper.js": "^1.14.7",
        "ui-bootstrap4": "^3.0.6"
    },
}
