SHELL := /usr/bin/env bash

help:
	@cat USAGE.md

install: help
	@npm install
	@cp node_modules/marked/lib/marked.js ./js/

start: build
	@node server.js

watch:
	@watch $(MAKE) build

build: install
	@./scripts/manifest.sh > ./manifest.appcache

deploy: build
	@git checkout gh-pages
	@git pull
	@git add --all .
	@git commit -am "New lessons"
	@git push

.PHONY: \
	help \
	install \
	build \
	watch \
	deploy \
	start \
