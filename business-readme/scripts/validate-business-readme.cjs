#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || process.cwd());
const readmePath = path.join(root, 'README.md');
const contextPath = path.join(root, 'docs', 'LLM_CONTEXT.md');
const errors = [];

function readText(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    errors.push(`${label} missing: ${filePath}`);
    return '';
  }
}

function markerPair(text, start, end, label) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);

  if (startIndex === -1) errors.push(`${label} missing start marker: ${start}`);
  if (endIndex === -1) errors.push(`${label} missing end marker: ${end}`);
  if (startIndex !== -1 && endIndex !== -1 && startIndex >= endIndex) {
    errors.push(`${label} start marker must appear before end marker`);
  }

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return '';
  }

  return text.slice(startIndex + start.length, endIndex).trim();
}

function requireNonEmpty(block, label) {
  if (block.replace(/[#\s-]/g, '').length < 20) {
    errors.push(`${label} block is too short or empty`);
  }
}

function rejectPlaceholders(block, label) {
  // Dev markers must stay case-sensitive: an unfilled template writes them in
  // caps, while lowercase "todo"/"tbd" is ordinary prose in pt-BR/es.
  const devMarker = /\b(TODO|TBD|FIXME|PLACEHOLDER)\b/;
  const templateBracket = /\[(Complete product rules|How to install|Pointers only|Only what reading|Only unresolved|Only decisions)[^\]]*\]/i;
  if (devMarker.test(block) || templateBracket.test(block)) {
    errors.push(`${label} contains placeholder text`);
  }
}

const readme = readText(readmePath, 'README.md');
const context = readText(contextPath, 'docs/LLM_CONTEXT.md');

const businessStart = '<!-- business-readme:business-rules:start -->';
const businessEnd = '<!-- business-readme:business-rules:end -->';
const technicalStart = '<!-- business-readme:technical:start -->';
const technicalEnd = '<!-- business-readme:technical:end -->';
const contextStart = '<!-- business-readme:context:start -->';
const contextEnd = '<!-- business-readme:context:end -->';

if (readme) {
  const businessBlock = markerPair(readme, businessStart, businessEnd, 'README business rules');
  const technicalBlock = markerPair(readme, technicalStart, technicalEnd, 'README technical guide');

  requireNonEmpty(businessBlock, 'README business rules');
  requireNonEmpty(technicalBlock, 'README technical guide');
  rejectPlaceholders(businessBlock, 'README business rules');
  rejectPlaceholders(technicalBlock, 'README technical guide');

  const businessIndex = readme.indexOf(businessStart);
  const technicalIndex = readme.indexOf(technicalStart);
  if (businessIndex !== -1 && technicalIndex !== -1 && businessIndex > technicalIndex) {
    errors.push('README business rules must appear before technical guide');
  }
}

if (context) {
  const contextBlock = markerPair(context, contextStart, contextEnd, 'LLM_CONTEXT');
  requireNonEmpty(contextBlock, 'LLM_CONTEXT');
  rejectPlaceholders(contextBlock, 'LLM_CONTEXT');

  const requiredContextSections = [
    'Current business rule map',
    'Non-inferable technical facts',
    'Conflicts and unknowns',
    'Durable decisions and gotchas',
  ];

  for (const section of requiredContextSections) {
    const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`^##\\s+${escaped}\\s*$`, 'm').test(contextBlock)) {
      errors.push(`LLM_CONTEXT must contain a ${section} section`);
    }
  }

  // Size is a soft cost signal (redundant context ≈ +20% inference cost,
  // arXiv:2602.11988): warn past ~100 lines, never fail.
  const contextLines = contextBlock.split('\n').length;
  if (contextLines > 100) {
    console.warn(
      `warning: LLM_CONTEXT block has ${contextLines} lines (recommended <= 100); cut inferable content first`
    );
  }
}

if (errors.length > 0) {
  console.error('business-readme validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('business-readme validation passed');
