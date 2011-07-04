VERSION = 0.70

COMMON_FILES := common/*.*
CHROME_FILES = $(COMMON_FILES) chrome/*.*
SAFARI_FILES = $(COMMON_FILES) safari/*.*

all: build/sbnbl.zip build/sbnbl.safariextension

clean:
	rm -rf build

build/sbnbl.zip: $(CHROME_FILES)
	install -d -m 755 build/chrome
	for file in $(CHROME_FILES); do \
		echo $$file; \
		cp $$file build/chrome/; \
		done
	sed -e 's,@VERSION@,$(VERSION),g' chrome/manifest.json > build/chrome/manifest.json
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
	sed -e 's,@VERSION@,$(VERSION),g' safari/Info.plist > $@/Info.plist

safari/%.plist: build/sbnbl.safariextension/%.plist
	cp $< $@

update: safari/Info.plist safari/Settings.plist
	$(MAKE) all
