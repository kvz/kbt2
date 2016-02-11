#!/usr/bin/env bash
# Copyright (c) 2014, Kevin van Zonneveld

set -o pipefail
set -o errexit
set -o nounset
# set -o xtrace

# Set magic variables for current FILE & DIR
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)"

convert favicon.png -fuzz 2% -transparent white favicon.png
convert -resize 128x128 -gravity center -transparent white -background transparent favicon.png favicon-128.png
convert -resize 512x512 -gravity center -transparent white -background transparent favicon.png favicon-512.png
convert -trim -resize x16 -gravity center -crop 16x16+0+0 favicon.png -flatten -colors 256 favicon.ico
