#!/bin/bash
error_exit() {
  echo "$1"
  exit 1
}

if [[ $# -ne 1 ]]; then
    error_exit "openshift-deploy <ApplicationDeploymentRef>"
fi

echo "Npm build"
npm run build

echo "Npm pack"
npm pack

webleveransepakke=$(find . -maxdepth 1 -type f -name "*.tgz")

echo "Starting AO Dev Rollout"
ao dev rollout $1 $webleveransepakke --nodejs 20

echo "Done!"
