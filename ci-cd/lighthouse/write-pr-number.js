const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { PR_NUMBER, REF } = process.env;

const isCreatedPR = REF.indexOf('/pull/') > -1;

if (!isCreatedPR) return;

console.warn('!!!!!!!!!!!!!!!\n', PR_NUMBER);
console.warn('!!!!!!!!!!!!!!!\n', REF);

fs.writeFileSync(path.join(__dirname, '..', '..', 'pr-number.txt'), PR_NUMBER, { encoding: 'utf8' });
