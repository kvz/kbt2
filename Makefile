SHELL := /usr/bin/env bash

help:
	@cat USAGE.md

.PHONY: favicon
favicon:
	convert favicon.png -fuzz 2% -transparent white favicon.png
	convert -resize 128x128 -gravity center -transparent white -background transparent favicon.png favicon-128.png
	convert -resize 512x512 -gravity center -transparent white -background transparent favicon.png favicon-512.png
	convert -trim -resize x16 -gravity center -crop 16x16+0+0 favicon.png -flatten -colors 256 favicon.ico

.PHONY: install
install: help
	@npm install
	@cp node_modules/marked/lib/marked.js ./js/

.PHONY: start
start: build
	@node server.js

.PHONY: watch
watch:
	@watch $(MAKE) build

.PHONY: build
build: install
	@./scripts/manifest.sh > ./manifest.appcache

.PHONY: deploy
deploy: build
	@git checkout gh-pages
	@git pull
	@git add --all .
	@git commit -am "New lessons"
	@git push
