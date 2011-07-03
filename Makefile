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
	zip -9 -j $@ build/chrome/*

build/sbnbl.safariextension: $(SAFARI_FILES)
	install -d -m 755 build/sbnbl.safariextension
	touch build/sbnbl.safariextension
	for file in $(SAFARI_FILES); do \
		echo $$file; \
		cp $$file build/sbnbl.safariextension/; \
		done
