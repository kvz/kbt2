SHELL := /usr/bin/env bash

start: update
	node server.js

update:
	./scripts/manifest.sh > ./manifest.appcache

publish: update
	git checkout gh-pages
	git pull
	git add --all .
	git commit -am "New lessons"
	git push

.PHONY: \
	update \
	publish \
	start \
