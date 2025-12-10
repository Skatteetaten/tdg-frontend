#!/usr/bin/env groovy
def jenkinsfile

def overrides = [
    scriptVersion  : 'v7',
    pipelineScript: 'https://git.aurora.skead.no/scm/ao/aurora-pipeline-scripts.git',
    iqOrganizationName: "Team RST",
    iqCredentialsId: 'ci_tdg_public',
    iqBreakOnUnstable: false,
    iqEmbedded: true,
    versionStrategy: [
      [ branch: 'master', versionHint: '1']
    ],
    sonarQube: true,
    npmInstallCommand: "ci",
    nodeVersion: "22"
]

fileLoader.withGit(overrides.pipelineScript, overrides.scriptVersion) {
  jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

jenkinsfile.run(overrides.scriptVersion, overrides)
