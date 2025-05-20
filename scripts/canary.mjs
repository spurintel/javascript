#!/usr/bin/env zx

import { $, echo } from 'zx';

const CHANGESET_CONFIG_FILE = '.changeset/config.json';

await $`pnpm dlx json -I -f ${CHANGESET_CONFIG_FILE} -e "this.changelog = false"`;

const res = await $`pnpm changeset version --snapshot canary`;
const success = !res.stderr.includes('No unreleased changesets found');

await $`git checkout HEAD -- ${CHANGESET_CONFIG_FILE}`;

if (success) {
  echo('success=1');
} else {
  echo('success=0');
}
