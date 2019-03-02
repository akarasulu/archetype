local settings = import "personal-settings.jsonnet"; 

/**
  Used for the initially generated package.json.
 */
function (name, main="lib/index.js", author="unknown", description="unknown") {
    archetype: "base",
    name: name,                             
    version: if std.objectHas(settings, "preferred_start_version") then 
                settings.start_version 
             else 
                "0.0.1",
    description: description,
    main: main,
    /**
       Take first the personal settings value if set, and if not
       then take the author value which can be pumped in as an 
       arguement or use its default value.
     */
    author: if std.objectHas(settings, "author") then 
                settings.author 
            else
                author,
    repository: if std.objectHas(settings, "git_base") then 
                    settings.git_base + "/" + name
                else
                    "https://github.com/" + self.author
    ,                       
    bugs: self.repository + "/issues", 
    scripts: {                              
        test: "echo \"Error: no test specified\" && exit 1"
    },
    files: [
        "/bin",
        "/lib"
    ],
    keywords: [],
    license: if std.objectHas(settings, "license") then 
                settings.license
            else
                "MIT"
}
