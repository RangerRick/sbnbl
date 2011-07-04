VERSION = 0.72

COMMON_FILES := common/*.* common/common.js
CHROME_FILES = $(COMMON_FILES) chrome/*.* chrome/manifest.json
SAFARI_FILES = $(COMMON_FILES) safari/*.* safari/Info.plist

all: build/sbnbl.zip build/sbnbl.safariextension

clean:
	rm -rf build

%: %.in Makefile
	sed -e 's,@VERSION@,$(VERSION),g' $< > $@

build/sbnbl.zip: $(CHROME_FILES)
	install -d -m 755 build/chrome
	for file in $(CHROME_FILES); do \
		echo $$file; \
		cp $$file build/chrome/; \
		done
	zip -9 -j $@ build/chrome/*

build/sbnbl.safariextension: $(SAFARI_FILES)
	install -d -m 755 $@
	touch $@
	for file in $(SAFARI_FILES); do \
		echo $$file; \
		cp $$file $@/; \
		done
	cp common/128.png $@/Icon.png
	cp common/48.png $@/Icon-48.png
