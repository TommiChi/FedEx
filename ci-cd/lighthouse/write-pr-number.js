const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { PR_NUMBER, REF } = process.env;

console.warn('!!!!!!!!!!!!!!!\n', PR_PATH);
console.warn('!!!!!!!!!!!!!!!\n', PR_PATH.split('/').reverse().find((part) => /^(\d+)$/.test(part)));

const isCreatedPR = REF.indexOf('/pull/') > -1;

if (!isCreatedPR) return;

fs.writeFileSync(path.join(__dirname, '..', '..', 'pr-number.txt'), PR_NUMBER, { encoding: 'utf8' });
