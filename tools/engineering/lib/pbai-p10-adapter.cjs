"use strict";
module.exports = function expertAdapter(text) {
 const anchor = 'level === "hard"';
 if (text.split(anchor).length !== 4) throw Error('Unexpected frozen adapter');
 const expanded=text.split(anchor).join('(level === "hard" || level === "expert")');
 const identity='return { label: "Logic Gate AI", labelJa: "論理ゲートAI", releaseId: "PBAI-C015-HARD-ADOPTION-001" };';
 if(expanded.split(identity).length!==2)throw Error('Unexpected identity anchor');
 return expanded.replace(identity,'if (level === "expert") return { label: "Logic Gate AI (expert test)", labelJa: "論理ゲートAI（expert検証用）", releaseId: "PBAI-P10-EXPERT-PREVIEW" };\n    '+identity);
};
