#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/tactical-motif-human-validation-stage1.js");

const FREEZE_SPEC_PATH = path.join(C.ROOT, "doc/tactical-motif-human-validation/preregistration/STAGE_1_FORMAL_STIMULUS_FREEZE_SPEC.json");

function fileSha256(file) {
  return C.sha256(fs.readFileSync(file));
}

function readFreezeSpec() {
  const raw = fs.readFileSync(FREEZE_SPEC_PATH);
  const spec = JSON.parse(raw.toString("utf8"));
  if (spec.schemaVersion !== 1 || spec.freezeId !== "TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1") {
    throw new Error("Unexpected formal-stimulus freeze specification identity");
  }
  if (spec.humanDataCollectionAuthorized !== false || spec.scientificHumanInferenceAuthorized !== false) {
    throw new Error("Formal-stimulus freeze specification violates human-data firewall");
  }
  return { spec, specSha256: C.sha256(raw) };
}

function parseArgs(argv) {
  const out = {
    input: C.DEFAULT_OUTPUT,
    privateOutput: null,
    auditOutput: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${flag}`);
    if (flag === "--input") out.input = path.resolve(value);
    else if (flag === "--private-output") out.privateOutput = path.resolve(value);
    else if (flag === "--audit-output") out.auditOutput = path.resolve(value);
    else throw new Error(`Unknown argument: ${flag}`);
  }
  out.privateOutput ||= path.join(out.input, "formal-stimulus-freeze.private.json");
  out.auditOutput ||= path.join(out.input, "formal-stimulus-freeze-audit.json");
  return out;
}

function loadAndVerifyInputs(input, freezeSpec) {
  const files = {
    manifest: path.join(input, "manifest.json"),
    verification: path.join(input, "verification.json"),
    stimulusPoolAudit: path.join(input, "stimulus-pool-audit.json"),
    stimulusPool: path.join(input, "stimulus-pool.json"),
  };
  for (const file of Object.values(files)) {
    if (!fs.existsSync(file)) throw new Error(`Missing required Stage 1 artifact: ${file}`);
  }

  const actual = {
    manifestSha256: fileSha256(files.manifest),
    verificationSha256: fileSha256(files.verification),
    stimulusPoolAuditSha256: fileSha256(files.stimulusPoolAudit),
    stimulusPoolSha256: fileSha256(files.stimulusPool),
  };
  for (const [key, value] of Object.entries(actual)) {
    if (value !== freezeSpec.inputArtifacts[key]) {
      throw new Error(`Frozen input artifact hash mismatch for ${key}: ${value}`);
    }
  }

  const manifest = C.readJson(files.manifest);
  const verification = C.readJson(files.verification);
  const stimulusPoolAudit = C.readJson(files.stimulusPoolAudit);
  const stimulusPool = C.readJson(files.stimulusPool);
  const { spec: stage1Spec, specSha256: stage1SpecSha256 } = C.loadSpec();

  if (stage1SpecSha256 !== manifest.specSha256 || stage1SpecSha256 !== verification.specSha256 || stage1SpecSha256 !== stimulusPoolAudit.specSha256 || stage1SpecSha256 !== stimulusPool.specSha256) {
    throw new Error("Stage 1 spec identity mismatch across frozen inputs");
  }
  if (verification.passed !== true || verification.fullSearchRecomputation !== true || verification.mismatchCount !== 0) {
    throw new Error("Frozen verification artifact is not a full zero-mismatch PASS");
  }
  if (stimulusPoolAudit.passed !== true || stimulusPoolAudit.selectionOutcomeBlind !== true || stimulusPoolAudit.humanResponsesInspected !== false) {
    throw new Error("Frozen stimulus-pool audit is not an outcome-blind PASS");
  }
  if (stimulusPool.poolHash !== freezeSpec.inputArtifacts.poolHash || stimulusPoolAudit.poolHash !== freezeSpec.inputArtifacts.poolHash) {
    throw new Error("Frozen poolHash mismatch");
  }
  if (verification.verificationIdentityHash !== freezeSpec.inputArtifacts.verificationIdentityHash) {
    throw new Error("Frozen verification identity hash mismatch");
  }
  if (manifest.humanDataCollectionAuthorized !== false || verification.humanDataCollectionAuthorized !== false || stimulusPool.humanDataCollectionAuthorized !== false) {
    throw new Error("Input artifact violates human-data firewall");
  }

  return { actual, manifest, verification, stimulusPoolAudit, stimulusPool, stage1Spec };
}

function participantStimulusSha256(row) {
  return C.sha256(JSON.stringify(row.participantStimulus));
}

function privateRecord(row) {
  return {
    className: row.className,
    historicalTrajectoryHash: row.historicalTrajectoryHash,
    seed: row.seed,
    gameId: row.gameId,
    conditionId: row.conditionId,
    openingPrefixHash: row.openingPrefixHash,
    ply: row.ply,
    ruleStateKey: row.ruleStateKey,
    historicalStateHash: row.historicalStateHash,
    actorFeatures: row.actorFeatures,
    state: row.state,
    participantStimulus: row.participantStimulus,
    participantStimulusSha256: participantStimulusSha256(row),
  };
}

function reserve(row, used) {
  used.rule.add(row.ruleStateKey);
  used.trajectory.add(row.historicalTrajectoryHash);
  used.opening.add(row.openingPrefixHash);
}

function unusedGlobally(row, used) {
  return !used.rule.has(row.ruleStateKey) && !used.trajectory.has(row.historicalTrajectoryHash) && !used.opening.has(row.openingPrefixHash);
}

function selectFormalStimuli(pool, stage1Spec, freezeSpec) {
  const maps = Object.fromEntries(Object.entries(pool.classes).map(([name, rows]) => [name, new Map(rows.map((row) => [row.ruleStateKey, row]))]));
  const used = { rule: new Set(), trajectory: new Set(), opening: new Set() };
  const blocks = [];

  for (let i = 0; i < freezeSpec.primaryBlocks.slotControlSequence.length; i += 1) {
    const slot = i + 1;
    const controlClass = freezeSpec.primaryBlocks.slotControlSequence[i];
    const rankedPairs = pool.matches[controlClass].map((match) => {
      const targetA = maps.C03_TARGET.get(match.targetRuleStateKey);
      const control = maps[controlClass].get(match.controlRuleStateKey);
      if (!targetA || !control) throw new Error(`Pool match references absent state in slot ${slot}`);
      return {
        match,
        targetA,
        control,
        rank: C.sha256(`TMHV-S1-FORMAL-BLOCK-v1|${slot}|${controlClass}|${targetA.ruleStateKey}|${control.ruleStateKey}`),
      };
    }).filter(({ targetA, control }) => {
      if (!unusedGlobally(targetA, used) || !unusedGlobally(control, used)) return false;
      if (targetA.historicalTrajectoryHash === control.historicalTrajectoryHash) return false;
      if (targetA.openingPrefixHash === control.openingPrefixHash) return false;
      return true;
    }).sort((a, b) => a.match.cost - b.match.cost || a.rank.localeCompare(b.rank));

    let chosen = null;
    for (const pair of rankedPairs) {
      const targetBCandidates = pool.classes.C03_TARGET.filter((targetB) => {
        if (!unusedGlobally(targetB, used)) return false;
        if (targetB.ruleStateKey === pair.targetA.ruleStateKey) return false;
        if (targetB.historicalTrajectoryHash === pair.targetA.historicalTrajectoryHash || targetB.historicalTrajectoryHash === pair.control.historicalTrajectoryHash) return false;
        if (targetB.openingPrefixHash === pair.targetA.openingPrefixHash || targetB.openingPrefixHash === pair.control.openingPrefixHash) return false;
        return C.matchCost(pair.targetA, targetB, stage1Spec) <= freezeSpec.primaryBlocks.targetBSelection.maximumAcceptedCost;
      }).map((targetB) => ({
        targetB,
        cost: C.matchCost(pair.targetA, targetB, stage1Spec),
        rank: C.sha256(`TMHV-S1-FORMAL-TARGETB-v1|${slot}|${controlClass}|${pair.targetA.ruleStateKey}|${pair.control.ruleStateKey}|${targetB.ruleStateKey}`),
      })).sort((a, b) => a.cost - b.cost || a.rank.localeCompare(b.rank));

      if (!targetBCandidates.length) continue;
      chosen = { pair, targetB: targetBCandidates[0] };
      break;
    }

    if (!chosen) {
      throw new Error(`TECHNICAL-INCONCLUSIVE: no eligible formal block for slot ${slot} / ${controlClass}`);
    }

    const { targetA, control, match } = chosen.pair;
    const { targetB, cost: targetATargetBMatchCost } = chosen.targetB;
    for (const row of [targetA, targetB, control]) reserve(row, used);
    blocks.push({
      slot,
      controlClass,
      targetAControlMatchCost: match.cost,
      targetATargetBMatchCost,
      correctPair: ["targetA", "targetB"],
      targetA: privateRecord(targetA),
      targetB: privateRecord(targetB),
      control: privateRecord(control),
    });
  }

  const secondary = [];
  for (const conditionId of freezeSpec.secondaryMoveChoice.stratumOrder) {
    const candidates = pool.classes.C03_TARGET.filter((row) => row.conditionId === conditionId && unusedGlobally(row, used)).map((row) => ({
      row,
      rank: C.sha256(`TMHV-S1-SECONDARY-v1|${conditionId}|${row.ruleStateKey}`),
    })).sort((a, b) => a.rank.localeCompare(b.rank));
    if (!candidates.length) {
      throw new Error(`TECHNICAL-INCONCLUSIVE: no unused secondary C03 target for ${conditionId}`);
    }
    const row = candidates[0].row;
    reserve(row, used);
    secondary.push({ conditionId, target: privateRecord(row) });
  }

  return { blocks, secondary, used };
}

function aggregateConditionCounts(records) {
  const out = {};
  for (const row of records) out[row.conditionId] = (out[row.conditionId] || 0) + 1;
  return out;
}

function materialize(input, privateOutput, auditOutput) {
  const { spec: freezeSpec, specSha256: selectionSpecSha256 } = readFreezeSpec();
  const verified = loadAndVerifyInputs(input, freezeSpec);
  const selected = selectFormalStimuli(verified.stimulusPool, verified.stage1Spec, freezeSpec);

  const privateFreeze = {
    schemaVersion: 1,
    stageId: freezeSpec.stageId,
    freezeId: freezeSpec.freezeId,
    selectionSpecSha256,
    inputArtifactSha256: verified.actual,
    inputPoolHash: freezeSpec.inputArtifacts.poolHash,
    humanDataCollectionAuthorized: false,
    scientificHumanInferenceAuthorized: false,
    primaryBlocks: selected.blocks,
    secondaryMoveChoice: selected.secondary,
  };
  C.writeJson(privateOutput, privateFreeze);
  const privateFreezeSha256 = fileSha256(privateOutput);

  const primaryRows = selected.blocks.flatMap((b) => [b.targetA, b.targetB, b.control]);
  const secondaryRows = selected.secondary.map((x) => x.target);
  const allRows = [...primaryRows, ...secondaryRows];
  const controlBalance = Object.fromEntries(freezeSpec.primaryBlocks.slotControlSequence.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map()));
  const primaryMatchCosts = selected.blocks.map((b) => ({ controlClass: b.controlClass, targetAControl: b.targetAControlMatchCost, targetATargetB: b.targetATargetBMatchCost }));
  const checks = {
    primaryBlockCount: selected.blocks.length === freezeSpec.primaryBlocks.count,
    controlBalance: JSON.stringify(controlBalance) === JSON.stringify(freezeSpec.primaryBlocks.controlBalance),
    secondaryCount: selected.secondary.length === freezeSpec.secondaryMoveChoice.count,
    expectedUniqueFormalPositions: allRows.length === freezeSpec.expectedUniqueFormalPositions,
    uniqueRuleStates: new Set(allRows.map((x) => x.ruleStateKey)).size === allRows.length,
    uniqueHistoricalTrajectories: new Set(allRows.map((x) => x.historicalTrajectoryHash)).size === allRows.length,
    uniqueOpeningPrefixes: new Set(allRows.map((x) => x.openingPrefixHash)).size === allRows.length,
    primaryActorsSouth: primaryRows.every((x) => x.participantStimulus.actor === "south"),
    primaryPhaseMtaji: primaryRows.every((x) => x.participantStimulus.phase === "mtaji"),
    noHumanAuthorization: privateFreeze.humanDataCollectionAuthorized === false && privateFreeze.scientificHumanInferenceAuthorized === false,
  };

  const publicAudit = {
    schemaVersion: 1,
    stageId: freezeSpec.stageId,
    freezeId: freezeSpec.freezeId,
    selectionSpecSha256,
    inputArtifactSha256: verified.actual,
    inputPoolHash: freezeSpec.inputArtifacts.poolHash,
    passed: Object.values(checks).every(Boolean),
    humanDataCollectionAuthorized: false,
    scientificHumanInferenceAuthorized: false,
    privateFreezeSha256,
    publicExactStimulusIdentitiesIncluded: false,
    counts: {
      primaryBlocks: selected.blocks.length,
      primaryPositions: primaryRows.length,
      primaryC03Targets: selected.blocks.length * 2,
      primaryControls: selected.blocks.length,
      secondaryMoveChoiceTargets: selected.secondary.length,
      totalUniqueFormalPositions: allRows.length,
    },
    controlBalance,
    secondaryGenerationStrata: selected.secondary.map((x) => x.conditionId),
    aggregateConditionCounts: aggregateConditionCounts(allRows),
    primaryMatchCosts,
    checks,
    interpretationBoundary: {
      exactFormalMachineStimuliFrozen: Object.values(checks).every(Boolean),
      scientificRecruitmentAuthorized: false,
      formalHumanResponsesAuthorized: false,
      humanRecognitionClaimAuthorized: false,
      traditionalityClaimAuthorized: false,
    },
  };
  if (!publicAudit.passed) throw new Error("Formal stimulus freeze internal audit failed");
  C.writeJson(auditOutput, publicAudit);
  return publicAudit;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = materialize(args.input, args.privateOutput, args.auditOutput);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  FREEZE_SPEC_PATH,
  loadAndVerifyInputs,
  materialize,
  parseArgs,
  readFreezeSpec,
  selectFormalStimuli,
};
