const fs = require("fs-extra");

Promise.all([
    fs.remove("./results/screenshots"),
    fs.remove("./results/videos"),
])
.then(() => {
    return Promise.all([
        fs.copy("./cypress/screenshots", "./results/screenshots"),
        fs.copy("./cypress/videos", "./results/videos"),
    ]);
})
.then(() => {
    console.log("completed");
});
