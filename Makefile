VERSION = 1.2.1

COMMON_FILES := common/*.* common/common.js
CHROME_FILES = $(COMMON_FILES) chrome/*.* chrome/manifest.json
SAFARI_FILES = $(COMMON_FILES) safari/*.* safari/Info.plist
FIREFOX_FILES = $(COMMON_FILES) firefox/package.json firefox/lib/*.* firefox/data/*.*

all: build/sbnbl-chrome.zip build/sbnbl.safariextension build/sbnbl.xpi

clean:
	rm -rf build

%: %.in Makefile
	sed -e 's,@VERSION@,$(VERSION),g' $< > $@

build/sbnbl-chrome.zip: $(CHROME_FILES)
	install -d -m 755 build/chrome
	for file in $(CHROME_FILES); do \
		cp $$file build/chrome/; \
		done
	zip -9 -j $@ build/chrome/*

build/sbnbl.safariextension: $(SAFARI_FILES)
	install -d -m 755 $@
	touch $@
	for file in $(SAFARI_FILES); do \
		cp $$file $@/; \
		done
	cp common/128.png $@/Icon.png
	cp common/48.png $@/Icon-48.png

build/sbnbl.xpi: $(FIREFOX_FILES)
	install -d -m 755 build/firefox/data
	install -d -m 755 build/firefox/lib
	for file in $(COMMON_FILES); do \
		echo $$file; \
		cp $$file build/firefox/data/; \
		done
	cp common/128.png build/firefox/icon.png
	cp firefox/*.json build/firefox/
	cp firefox/lib/*.* build/firefox/lib/
	cp firefox/data/*.* build/firefox/data/
	rm build/firefox/data/*.in
#	cd build/firefox && \
#		cfx xpi && mv sbnbl.xpi .. && \
#		cd ..
