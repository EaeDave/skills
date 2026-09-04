---
name: jira
description: Inspect, create, and update MD Software Jira cards through the Executor MCP, including human worklogs, dates, statuses, comments, and commit links. Use when the user invokes /jira or asks to operate on Jira.
---

# Jira

Use the Executor MCP directly. Do not use Browser Relay.

## Start

1. Read `xd://mcp__executor_execute` and call `xd://mcp__executor_skills` with `{"name":"execute"}` once per session.
2. Use the exact paths below; use `tools.search()` only if a path no longer resolves.
3. Call `tools.describe.tool({ path })` before the first use of a write operation in the session.

## Existing card

1. Read the issue with `getIssue` using `expand: "names,schema,changelog"` and the fields needed for the request, including `description`, `comment`, dates, status, and time tracking.
2. Read its worklogs. Extract existing commit links from descriptions, comments, and worklogs.
3. Inspect the current conversation and only the relevant Git status, diff, log, files, and verification results. Include only commits belonging to the card; ask about ambiguous commits.
4. Draft the exact update in natural language. Explain user-visible behavior and business rules before light technical detail. State pending validation honestly.
5. If logging work and the user did not provide a duration, ask: **“Quantas horas devo registrar?”** Never infer hours.
6. Show one preview containing every field change, dates, duration, report, commit links, status, and estimate impact. Do not mutate Jira before explicit approval.
7. After approval, perform only the previewed mutations. Re-read the issue and worklogs to verify IDs, dates, duration, links, and status.

Never change the original description for a worklog-only request. Never change status, assignee, dates, or estimates unless shown in the approved preview.

## New card

1. Resolve project and issue type from the request; otherwise ask.
2. Read create metadata and search similar issues with JQL to preserve naming and avoid duplicates.
3. Draft summary, description, acceptance criteria, dates, and ownership. Show a full preview.
4. Create only after approval, then fetch the issue and return its key and link.

## Worklogs

- Use Atlassian Document Format (ADF) for the comment and link marks for commits.
- Use only `timeSpentSeconds` (`hours × 3600`), never send it together with `timeSpent`.
- Use `adjustEstimate: "leave"` unless the approved preview explicitly changes the estimate.
- Format `started` as `YYYY-MM-DDTHH:mm:ss.SSS-0300` for Brasília time when no other timezone is requested.
- Jira displays 8 hours as `1d`; report both meanings when useful.
- Before retrying any failed worklog creation, fetch worklogs again and prove the first attempt created nothing.

## Executor paths

```text
jira_mdsoftware.user.personaljiramdsoftware.issues.getIssue
jira_mdsoftware.user.personaljiramdsoftware.issues.getEditIssueMeta
jira_mdsoftware.user.personaljiramdsoftware.issues.editIssue
jira_mdsoftware.user.personaljiramdsoftware.issueWorklogs.getIssueWorklog
jira_mdsoftware.user.personaljiramdsoftware.issueWorklogs.addWorklog
jira_mdsoftware.user.personaljiramdsoftware.issues.getCreateIssueMeta
jira_mdsoftware.user.personaljiramdsoftware.issues.getCreateIssueMetaIssueTypes
jira_mdsoftware.user.personaljiramdsoftware.issues.getCreateIssueMetaIssueTypeId
jira_mdsoftware.user.personaljiramdsoftware.issues.createIssue
jira_mdsoftware.user.personaljiramdsoftware.issueSearch.searchForIssuesUsingJql
jira_mdsoftware.user.personaljiramdsoftware.issueComments.addComment
jira_mdsoftware.user.personaljiramdsoftware.issues.getTransitions
jira_mdsoftware.user.personaljiramdsoftware.issues.doTransition
```

Write JSON arguments to `xd://mcp__executor_execute`. A write may pause for confirmation. Resume through `xd://mcp__executor_resume` with `action: "accept"` and `content: "{}"` only when the user already approved the exact preview.

## MD Software fields

Known mappings, always verified through `getIssue` names before writing:

```text
Data de início -> customfield_10015
Data limite    -> duedate
```

Do not substitute `Actual start/end` or `Target start/end` unless explicitly requested.

## Output

Return the Jira link, changed fields, worklog ID and duration, included commit count, and verification result. On failure, state the exact operation that failed and what remains unchanged.
