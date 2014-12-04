SHELL := /usr/bin/env bash

update:
	./scripts/manifest.sh > ./manifest.appcache


.PHONY: \
	update \
