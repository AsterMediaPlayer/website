/*
 * thanks.html: thanks people for downloading, then sends them on to what they asked for.
 *
 * Download buttons anywhere on the site link here as thanks.html?get=<one of the keys below>. The page thanks them
 * and, a moment later, opens the store or starts the file download. A file download leaves this page on screen;
 * a store link opens the store, and the button stays here in case it didn't.
 *
 * To publish a download, fill in its url. An empty url shows "isn't available yet" instead of a broken link.
 */
(function () {
    'use strict';

    var DOWNLOADS = {
        apple: {
            name: 'Aster for Apple TV, iPhone and iPad',
            store: 'the App Store',
            url: 'https://apps.apple.com/us/app/aster-media-player/id6821328142',
            next: [
                'Open Aster, then add your server: type its address for Jellyfin or Emby, or choose Sign in with Plex.',
                'On Apple TV, Aster appears on the Home Screen once the download finishes.'
            ]
        },
        android: {
            name: 'Aster for Android and Android TV',
            store: 'Google Play',
            url: '',   // the Google Play link
            next: [
                'Open Aster, then add your server: type its address for Jellyfin or Emby, or choose Sign in with Plex.'
            ]
        },
        'android-apk': {
            name: 'Aster for Android and Android TV (APK)',
            file: true,
            url: 'https://github.com/AsterMediaPlayer/aster-android/releases/download/v0.11.0/aster-v0.11.0.apk',
            next: [
                'Open the downloaded file to install it. Android may ask you to allow installs from your browser or file manager first. Aster needs Android 8.0 or later.',
                'On Android TV, copy the file to the TV (for example with a file manager app) and open it there.',
                'Then open Aster and add your server.'
            ]
        },
        windows: {
            name: 'Aster for Windows (beta)',
            file: true,
            release: 'https://github.com/AsterMediaPlayer/aster-windows/releases/tag/v0.11.0-beta',
            choices: [
                { label: 'Installer (recommended)', note: '.exe · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-windows/releases/download/v0.11.0-beta/Aster-0.11.0-beta-windows-x64-setup.exe' },
                { label: 'Portable, runs from any folder', note: '.zip · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-windows/releases/download/v0.11.0-beta/Aster-0.11.0-beta-windows-x64.zip' }
            ],
            next: [
                'Open the installer and follow its steps; it doesn\'t need administrator rights. Or unzip the portable version anywhere and run Aster from there. Aster needs 64-bit Windows 10 (version 1809) or later.',
                'The app isn\'t signed yet, so Windows SmartScreen may warn you the first time. Choose More info, then Run anyway.',
                'Then open Aster and add your server. This is a beta, so if something goes wrong, email support@astermediaplayer.com.'
            ]
        },
        linux: {
            name: 'Aster for Linux (beta)',
            file: true,
            // Several packages: the page lists them instead of starting one. Each url is a file on the GitHub release.
            release: 'https://github.com/AsterMediaPlayer/aster-linux/releases/tag/v0.11.0-beta',
            choices: [
                { label: 'Debian, Ubuntu, Mint, Pop!_OS', note: '.deb · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster_0.11.0.beta_amd64.deb' },
                { label: 'Fedora, openSUSE', note: '.rpm · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster-0.11.0.beta-1.x86_64.rpm' },
                { label: 'Arch, Manjaro, CachyOS', note: '.pkg.tar.zst · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster-0.11.0beta-1-x86_64.pkg.tar.zst' },
                { label: 'Flatpak', note: '.flatpak · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/Aster-0.11.0-beta-x86_64.flatpak' },
                { label: 'Any other distribution', note: '.tar.gz · x64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/Aster-0.11.0-beta-linux-x64.tar.gz' },
                { label: 'Debian, Ubuntu on ARM (Raspberry Pi 5)', note: '.deb · ARM64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster_0.11.0.beta_arm64.deb' },
                { label: 'Fedora, openSUSE on ARM', note: '.rpm · ARM64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster-0.11.0.beta-1.aarch64.rpm' },
                { label: 'Arch on ARM', note: '.pkg.tar.zst · ARM64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/aster-0.11.0beta-1-aarch64.pkg.tar.zst' },
                { label: 'Any other distribution on ARM', note: '.tar.gz · ARM64',
                  url: 'https://github.com/AsterMediaPlayer/aster-linux/releases/download/v0.11.0-beta/Aster-0.11.0-beta-linux-arm64.tar.gz' }
            ],
            next: [
                'Debian and Ubuntu: sudo apt install ./aster_…_amd64.deb. Fedora: sudo dnf install ./aster-….rpm. Arch: sudo pacman -U aster-….pkg.tar.zst. These bring the mpv library with them.',
                'Flatpak: flatpak install --user Aster-….flatpak. Anything else: unpack the .tar.gz and run ./install.sh (it needs the mpv library installed).',
                'Trailers play inside the app when WebKitGTK 4.1 and GStreamer\'s good plugins are installed; otherwise they open in your browser.',
                'Then open Aster and add your server. This is a beta, so if something goes wrong, email support@astermediaplayer.com.'
            ]
        }
    };

    var DELAY_MS = 1500;

    function $(id) { return document.getElementById(id); }

    var key = new URLSearchParams(window.location.search).get('get');
    var d = key && Object.prototype.hasOwnProperty.call(DOWNLOADS, key) ? DOWNLOADS[key] : null;

    if (!d) {
        // Arrived without a download (or an unknown one): a general thank-you and the downloads to choose from.
        $('general').hidden = false;
        return;
    }

    $('download').hidden = false;
    $('what').textContent = d.name;

    var steps = $('next');
    d.next.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        steps.appendChild(li);
    });

    if (d.choices) {
        // One download per distribution: list them, and let the person pick instead of guessing.
        $('lede').textContent = 'Pick the package for your distribution. Your download starts when you choose one.';
        var list = document.createElement('ul');
        list.className = 'downloads';
        d.choices.forEach(function (c) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = c.url;
            a.setAttribute('download', '');
            a.textContent = c.label + ' ';
            var small = document.createElement('small');
            small.textContent = c.note;
            a.appendChild(small);
            li.appendChild(a);
            list.appendChild(li);
        });
        var row = $('go-row');
        row.parentNode.insertBefore(list, row);
        var go = $('go');
        go.href = d.release;
        go.className = 'btn btn-ghost';
        go.textContent = 'All files and release notes';
        $('go-note').textContent = 'On GitHub.';
        return;
    }

    if (!d.url) {
        var lede = $('lede');
        lede.textContent = "This download isn't available yet. It's coming soon: see what each version does on the ";
        var link = document.createElement('a');
        link.href = 'features.html';
        link.textContent = 'features page';
        lede.appendChild(link);
        lede.appendChild(document.createTextNode('.'));
        $('go-row').hidden = true;
        return;
    }

    var go = $('go');
    go.href = d.url;
    if (d.file) {
        $('lede').textContent = 'Your download will start in a moment.';
        go.textContent = 'Download again';
        $('go-note').textContent = "If it didn't start, use this button.";
        go.setAttribute('download', '');
    } else {
        $('lede').textContent = 'Opening ' + d.store + '…';
        go.textContent = 'Open ' + d.store;
        $('go-note').textContent = "If it didn't open, use this button.";
    }
    setTimeout(function () { window.location.href = d.url; }, DELAY_MS);
})();
