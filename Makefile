SHELL := /usr/bin/env bash

help:
	cat USAGE.md

install: help
	npm install

start: update
	node server.js

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
	publish \
	start \
