#!/usr/bin/env bash
# Copyright (c) 2014, Kevin van Zonneveld
#
# This file:
#
#  - Outputs a new manifest.appcache proposal to STDOUT
#
# Run as:
#
#  ./manifest.sh
#  ./bump.sh ./VERSION patch
#
# Returns:
#
# v0.0.1
#
# Requires:
#
#  - gsed on OSX (brew install gnu-sed)
#
# Authors:
#
#  - Kevin van Zonneveld (kvz.io)

set -o pipefail
set -o errexit
set -o nounset
# set -o xtrace

# Set magic variables for current FILE & DIR
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)"

gsed=""
[ -n "$(which sed)" ]  && gsed="$(which sed)"
[ -n "$(which gsed)" ] && gsed="$(which gsed)"

echo "CACHE MANIFEST"
echo "# Version 1.$(date +%s)"
echo ""

pushd ${__root} > /dev/null
find \
  css \
  js \
  lessons \
  fonts \
  images/headers/ui/dark \
  images/toolbars \
  index.html \
  favicon* \
  package.json \
  -type f \
| grep -v '/.DS_Store' \
| sort
popd > /dev/null

echo ""
echo "NETWORK:"
echo "*"
echo ""
echo "FALLBACK:"
echo "/ fallback.html"
