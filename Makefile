SHELL := /usr/bin/env bash

install:
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
	install \
	update \
	publish \
	start \
