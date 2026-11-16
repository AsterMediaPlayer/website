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
        // GitHub downloads always go to the repo's releases page, never a tagged release or file, so the
        // site never needs updating for a new version. (/releases/latest would skip the beta pre-releases.)
        'android-apk': {
            name: 'Aster for Android and Android TV (APK)',
            store: 'GitHub',
            url: 'https://github.com/AsterMediaPlayer/aster-android/releases',
            next: [
                'On the releases page, open the newest release and download the file ending in .apk.',
                'Open the downloaded file to install it. Android may ask you to allow installs from your browser or file manager first. Aster needs Android 8.0 or later.',
                'On Android TV, copy the file to the TV (for example with a file manager app) and open it there.',
                'Then open Aster and add your server.'
            ]
        },
        windows: {
            name: 'Aster for Windows (beta)',
            release: 'https://github.com/AsterMediaPlayer/aster-windows/releases',
            choices: [
                { label: 'Installer (recommended)', note: '…-windows-x64-setup.exe' },
                { label: 'Portable, runs from any folder', note: '…-windows-x64.zip' }
            ],
            next: [
                'Open the installer and follow its steps; it doesn\'t need administrator rights. Or unzip the portable version anywhere and run Aster from there. Aster needs 64-bit Windows 10 (version 1809) or later.',
                'The app isn\'t signed yet, so Windows SmartScreen may warn you the first time. Choose More info, then Run anyway.',
                'Then open Aster and add your server. This is a beta, so if something goes wrong, email support@astermediaplayer.com.'
            ]
        },
        linux: {
            name: 'Aster for Linux (beta)',
            release: 'https://github.com/AsterMediaPlayer/aster-linux/releases',
            choices: [
                { label: 'Debian, Ubuntu, Mint, Pop!_OS', note: '…_amd64.deb' },
                { label: 'Fedora, openSUSE', note: '…x86_64.rpm' },
                { label: 'Arch, Manjaro, CachyOS', note: '…x86_64.pkg.tar.zst' },
                { label: 'Flatpak', note: '…x86_64.flatpak' },
                { label: 'Any other distribution', note: '…linux-x64.tar.gz' },
                { label: 'Debian, Ubuntu on ARM (Raspberry Pi 5)', note: '…_arm64.deb' },
                { label: 'Fedora, openSUSE on ARM', note: '…aarch64.rpm' },
                { label: 'Arch on ARM', note: '…aarch64.pkg.tar.zst' },
                { label: 'Any other distribution on ARM', note: '…linux-arm64.tar.gz' }
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
        // Several files: say which one to pick, then send them to the releases page for it.
        $('lede').textContent = 'Downloads are on GitHub. Find your system below, then download that file from the newest release.';
        var list = document.createElement('ul');
        list.className = 'downloads';
        d.choices.forEach(function (c) {
            var li = document.createElement('li');
            var row = document.createElement('span');
            row.className = 'pick';
            row.textContent = c.label + ' ';
            var small = document.createElement('small');
            small.textContent = c.note;
            row.appendChild(small);
            li.appendChild(row);
            list.appendChild(li);
        });
        var goRow = $('go-row');
        goRow.parentNode.insertBefore(list, goRow);
        var go = $('go');
        go.href = d.release;
        go.textContent = 'Open the releases page';
        $('go-note').textContent = 'On GitHub. Pick the newest release, then your file.';
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
