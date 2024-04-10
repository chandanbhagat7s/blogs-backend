var mammoth = require("mammoth");
const fs = require('fs');

mammoth.convertToHtml({ path: "./name.docx" })
    .then(function (result) {
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        console.log(html, messages);


        fs.writeFile('./index.html', html, (err) => {
            console.log(err);
        })
    })
    .catch(function (error) {
        console.error(error);
    });