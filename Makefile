SHELL := /usr/bin/env bash

help:
	cat USAGE.md

install: help
	npm install
	cp node_modules/marked/lib/marked.js ./js/

start: update
	node server.js

watch:
	watch $(MAKE) update

update: install
	./scripts/manifest.sh > ./manifest.appcache

publish: update
	git checkout gh-pages
	git pull
	git add --all .
	git commit -am "New lessons"
	git push

.PHONY: \
	help \
	install \
	update \
	watch \
	publish \
	start \
