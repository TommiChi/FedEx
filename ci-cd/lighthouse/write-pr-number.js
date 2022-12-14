const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { PR_PATH } = process.env;

fs.writeFileSync(path.join(__dirname, '..', '..', 'pr-number.txt'), PR_PATH.split('/').reverse().find((part) => /^(\d+)$/.test(part)));
