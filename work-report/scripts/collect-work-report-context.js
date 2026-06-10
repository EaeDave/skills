#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

function usage() {
  console.log(`Usage: node collect-work-report-context.js [project-root] [--base <ref>] [--limit <n>]

Prints compact Git context for a human work report.

Options:
  --base <ref>   Base ref for branch commits, for example origin/main.
  --limit <n>    Max commits per section. Default: 12.`);
}

function parseArgs(argv) {
  const args = { root: process.cwd(), base: '', limit: 12 };
  let rootSet = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }

    if (arg === '--base') {
      args.base = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--base=')) {
      args.base = arg.slice('--base='.length);
      continue;
    }

    if (arg === '--limit') {
      args.limit = parseLimit(argv[index + 1], args.limit);
      index += 1;
      continue;
    }

    if (arg.startsWith('--limit=')) {
      args.limit = parseLimit(arg.slice('--limit='.length), args.limit);
      continue;
    }

    if (!arg.startsWith('-') && !rootSet) {
      args.root = arg;
      rootSet = true;
    }
  }

  return args;
}

function parseLimit(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, 50);
}

function git(cwd, args) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch (_error) {
    return '';
  }
}

function hasRevision(cwd, ref) {
  if (!ref) return false;
  return git(cwd, ['rev-parse', '--verify', `${ref}^{commit}`]) !== '';
}

function firstExistingRef(cwd, refs) {
  for (const ref of refs) {
    if (hasRevision(cwd, ref)) return ref;
  }
  return '';
}

function fenced(value) {
  return value ? `\`\`\`\n${value}\n\`\`\`` : '_None observed._';
}

function section(title, body) {
  console.log(`## ${title}`);
  console.log(body || '_None observed._');
  console.log('');
}

const options = parseArgs(process.argv);
const startRoot = path.resolve(options.root);
const gitRoot = git(startRoot, ['rev-parse', '--show-toplevel']);

if (!gitRoot) {
  console.error(`Not a Git repository: ${startRoot}`);
  process.exit(1);
}

const branch = git(gitRoot, ['branch', '--show-current']) || `(detached at ${git(gitRoot, ['rev-parse', '--short', 'HEAD']) || 'unknown'})`;
const upstream = git(gitRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
const base = options.base && hasRevision(gitRoot, options.base)
  ? options.base
  : firstExistingRef(gitRoot, ['origin/main', 'origin/master', 'origin/develop', 'main', 'master', 'develop']);
const limit = String(options.limit);

console.log('# Work report context');
console.log('');
console.log(`- Generated: ${new Date().toISOString()}`);
console.log(`- Repository: ${gitRoot}`);
console.log(`- Branch: ${branch}`);
console.log(`- Upstream: ${upstream || 'none'}`);
console.log(`- Base ref: ${base || 'none'}`);
console.log('');

section('Branch state', fenced(git(gitRoot, ['status', '--short', '--branch'])));
section('Working tree files', fenced(git(gitRoot, ['status', '--short'])));
section('Staged diff stat', fenced(git(gitRoot, ['diff', '--cached', '--stat'])));
section('Unstaged diff stat', fenced(git(gitRoot, ['diff', '--stat'])));

if (upstream) {
  section(`Commits ahead of upstream (${upstream}..HEAD)`, fenced(git(gitRoot, ['log', '--oneline', '--decorate=short', `--max-count=${limit}`, `${upstream}..HEAD`])));
} else {
  section('Commits ahead of upstream', '_No upstream configured._');
}

if (base) {
  section(`Commits since base (${base}..HEAD)`, fenced(git(gitRoot, ['log', '--oneline', '--decorate=short', `--max-count=${limit}`, `${base}..HEAD`])));
  section(`Branch diff stat (${base}...HEAD)`, fenced(git(gitRoot, ['diff', '--stat', `${base}...HEAD`])));
} else {
  section('Commits since base', '_No base ref found._');
}

section('Recent commits', fenced(git(gitRoot, ['log', `--max-count=${limit}`, '--date=short', '--pretty=format:%h | %ad | %an | %s'])));

console.log('## Use in report');
console.log('- Combine this Git context with the current conversation and inspected diffs/files.');
console.log('- Include only commits tied to the current card or confirmed by the user.');
console.log('- Ask before including ambiguous commits.');
