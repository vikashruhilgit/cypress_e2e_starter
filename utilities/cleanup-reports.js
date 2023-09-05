const fs = require('fs-extra');

const reportsFolder = './mochawesome-report';

Promise.all([
    fs.remove('./results'),
    fs.remove('./cypress/videos'),
    fs.remove('./cypress/screenshots'),
    fs.remove('./cypress/downloads'),
    fs.remove('./cypress/reports')
])
.then(() => console.log('Previous reports deleted successfully!'))
.catch((err) => console.error('Error while deleting reports:', err));
    