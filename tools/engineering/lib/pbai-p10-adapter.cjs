"use strict";
module.exports = function expertAdapter(text) {
 const anchor = 'level === "hard"';
 if (text.split(anchor).length !== 4) throw Error('Unexpected frozen adapter');
 return text.split(anchor).join('(level === "hard" || level === "expert")');
};
