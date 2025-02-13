module.exports = {
  git: {
    requireCleanWorkingDir: true,
    commit: true,
    commitMessage: "chore: release v${version}",
    tag: true,
    tagName: "v${version}",
    push: true,
  },
  github: {
    release: true,
    releaseName: "Release v${version}",
  },
  npm: {
    publish: true,
  },
  hooks: {
    "before:init": "pnpm type-check && pnpm lint && pnpm build",
    "after:bump":
      "conventional-changelog -p conventionalcommits -i CHANGELOG.md -s || echo 'No previous changelog found'",
    "after:release": "echo Successfully released v${version}!",
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: "conventionalcommits",
      infile: "CHANGELOG.md",
    },
  },
};
