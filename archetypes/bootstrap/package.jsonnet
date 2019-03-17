local settings = import "personal-settings.jsonnet"; 
local parent = import "../base/package.jsonnet";

function (name, main="lib/index.js", author="unknown", description="unknown") {} + parent(name, main, author, description) +  {
    archetype: "bootstrap",
}
