# ETHICS_AND_DATA_GOVERNANCE — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-16  
Status: **PRE-COLLECTION DESIGN**

## 1. Recruitment gate

No scientific participant recruitment or response collection may start until:

1. participant information/consent materials are finalized;
2. the responsible researcher determines and documents the applicable institutional/funder/publication ethics-review requirement;
3. any required approval/exemption/not-required determination is obtained before recruitment;
4. private data storage and withdrawal workflow are operational.

The repository alone cannot determine which institutional ethics process applies to a future investigator. Absence of a repository-level requirement is not treated as ethics approval.

## 2. Data minimization

Collect only fields required for eligibility, provenance, and the prespecified scientific endpoints.

Expected categories:

- pseudonymous participant ID;
- age eligibility confirmation, not full birth date;
- Bao experience duration/category;
- qualification route/evidence category;
- neutral competence-screen result;
- prior C03 exposure flag;
- instrument language/version;
- task responses and timestamps needed for integrity;
- optional free-text explanations.

Avoid precise location, unnecessary demographic detail, government identifiers, or unrelated personal data.

## 3. Contact/linkage separation

Recruitment contact information must be stored separately from scientific responses. A private linkage table, if needed for withdrawal/duplicate handling, must not be committed to Git.

Public participant IDs must not embed name, email, phone, username, or other directly identifying values.

## 4. Public repository boundary

Public GitHub may contain:

- protocol/spec/schema;
- aggregate/de-identified summaries;
- stimulus identity hashes where they do not expose participant data;
- software/tooling;
- audit manifests and reproducibility metadata.

Public GitHub must not contain:

- names/contact details;
- raw participant identifiers/linkage keys;
- raw free text containing identifiable references;
- private eligibility documentation;
- potentially identifying metadata combinations.

`artifacts/local/` is gitignored, but ignored status is not sufficient security for identifiable raw data. Durable raw storage should be private and encrypted/access-controlled.

## 5. Free-text handling

Free-text explanations are treated as potentially identifying.

Before any public quotation:

- remove names/locations/unique personal references;
- confirm separate quotation permission if the consent form requires it;
- preserve original meaning without fabricating text;
- do not publish raw full-response dumps.

## 6. Withdrawal

Consent materials must state a concrete withdrawal deadline and mechanism.

Default design intent:

- identifiable/pseudonym-linkable raw data can be withdrawn until the preregistered de-linking/aggregate-freeze point;
- after irreversible de-identification/aggregate publication, selective removal may no longer be technically possible and this limitation must be disclosed before consent.

## 7. Retention

Provisional default:

- contact/linkage and identifiable raw material: retain only as long as necessary for study integrity/withdrawal, with a maximum target of 5 years after study closure/publication;
- de-identified aggregate/protocol/audit metadata: may be retained for reproducibility.

If an applicable institution/funder requires another retention period, it must be fixed before collection and documented as a protocol version change, not changed in response to outcomes.

## 8. Licensing and quotations

Participant consent to research use does not automatically imply permission to publish identifiable quotations or license raw responses under the repository software/documentation license. Quotation/public-release permission is handled separately.

## 9. Language and comprehension

Formal consent/instructions must be available in languages the enrolled experts can adequately understand. Planned instrument language support should prioritize Kiswahili and English; any additional formal-language version requires content-equivalence review before Stage 2.

## 10. Ethics-related stop rule

If required ethics determination, consent validity, or secure data handling is unresolved, stop before human data collection. Do not reinterpret technical readiness as permission to recruit participants.
