PhoenixMatrix web development proxy
===================================

[![Join the chat at https://gitter.im/Phoenixmatrix/phoenixmatrix-proxy](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Phoenixmatrix/phoenixmatrix-proxy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

_v0.2.1 technical preview_

Web debugging proxy in the spirit of Fiddler and Charles Proxy, written in JavaScript with [Electron Shell](http://electron.atom.io/)
and node.

Tested on MacOSX Yosemite, Windows 8.1 and Ubuntu 14.

## Release notes

**v0.2.2**
* Some rendering performance improvements
* No more OpenSSL dependency (using the fantastic [forge](https://github.com/digitalbazaar/forge)
    * That means Windows users can now launch PhoenixMatrix from powershell, cmd.exe, whatever. It "just works" on all 3 major platforms.
    * Since the certificates are now generated in javascript synchronously, there's few performance blips the first time. This will be addressed in the future.

**v0.2.1**
* Migrated from Angular to React

**v0.2.0**
* Moved from nw.js to Electron Shell
* Updated to the latest version of Babel
* Updated Babel transformer blacklist for features iojs supports natively to clean up the generated code
* Removed a bunch of hacks for cross platform support that are no longer necessary for Electron Shell.

## Warning: Technical Preview
This is a technical preview at best!!

The UI is far from finished, the code is a mess, there's a lot of bugs. Expect crashes, slowness, and generally an
unfinished product feel. It 'works' when stars are aligned, and that's as much as you should expect.

Again, the code is a mess. Please don't look at it and email me that its bad. For now my priority was to get things working.

### Features

![PhoenixMatrix web development proxy](/doc/example.png?raw=true "See what happens behind the scene")

* Works with all major browsers
* Works on all operating systems that Electron Shell (formerly Atom Shell) supports. Sorry Windows XP!
* Supports both http and https
* Allows real time https decryption with no scary warning (not even from Chrome!)
* Handles gzipped responses (doesn't yet decode base64 encoded bodies though. That's coming)
* Dynamically creates its own certificates for https decryption. No need to fiddle with OpenSSL! No OpenSSL dependencies whatsoever.
* Secure! The certificate authority is created on the fly the first time you launch PhoenixMatrix. No one else will have the private key.
* Free and open source the MIT license. Feel free to hack it up.
* Built on open web technology. JavaScript, CSS, node.js (well, Electron Shell uses a fork of io.js. Close enough!).
* Uses the latest EcmaScript 6 features, including generators, for [better asyncronous code](http://eng.localytics.com/better-asynchronous-javascript/)

### Setup
* Clone this repo
* Open a command prompt and navigate to the location where you cloned it.
* Run `npm install`. Electron Shell will be downloaded here, so expect a big download.
* Run `gulp`
* You should now see the GUI application. Setup the proxy in your browser of choice (or in your application), and you're good to go!
* From now on you can use `npm start` to run PhoenixMatrix without rebuilding everything.

### Configuring your browser to use the proxy

Different browsers and operating systems use different methods of configuring proxies. For IE, Safari and Chrome in Windows and MacOSX, configure
the proxy from the system settings/control panel. For FireFox, configure the proxy in the options -> advanced under network. The default port is 3002 but
can be configured

Exclude SSl/HTTPS from using the proxy if you don't need it and/or don't want to go through the steps to configure a certificate for man-in-the-middle decryption.

For https support, after running PhoenixMatrix, look in the certificate folder where you cloned the repo. Import `ca.crt` in your browser (Firefox)
or as a system certificate for most other browsers/operating systems. If prompted, the certificate only need to be used for websites. On Windows, the certificate needs to
be configured in the Trusted Certificate Authorities (you can just double click the certificate to launch the wizard). You may need to restart PhoenixMatrix and/or your browser after doing this.

PhoenixMatrix uses a certificate authority to generate individual server certificates, so only the one certificate needs to be installed.

**if your pages aren't loading**: If after installing the certificate in your browser, pages aren't loading, close PhoenixMatrix andor your browser and restart it/them. Seems like the invalid certificate
behavior of some browsers leave the proxy in a weird state

### Configuration

The available options can be found in phoenixmatrix.json, in JSON format (duh!).
* `includeConnect`: if you want to see http CONNECT requests, which will happen whenever you try to make an https request while using the proxy.
* `proxyPort`: used to configure which port the proxy listens to. Make sure to use a free port. Default to 3002.
* `httpsProxyPort`: used to configure on which port the https proxy listens to. This is only used internally and will not work
if you point your browser to it directly.
* `certificateExpiration`: how many days should the generated certificates be valid for

### Hacking and debugging PhoenixMatrix

PhoenixMatrix is built on top of Electron Shell, which in turn is built on top of Chromium and iojs.
This means you can easily add features or hack it up the same way you would a web page built with React and node/iojs.

Like the Chrome browser, Electron Shell supports the devtools you know: with the window focused, just hit ctrl+shift+i (command+shift+i on mac)!

### Caveats
* On MacOSX, when using the trackpad, scrolling isn't as smooth as it should be.
* As of the technical preview, it is not possible to directly disable https support. If you don't want to setup the certificate, ensure your browser is not
configured to use the proxy for HTTPS if you do not want it to stop you from browsing https sites during development.
* The proxy currently only checks individual server certificate expiration dates to regenerate them. If you get an error that the CA certificate isn't valid
even though you imported it, just delete the content of the certificate folder, restart PhoenixMatrix and import ca.crt again
* Expect the code to change a LOT from now on. This was hacked up quickly to get things working. If you make a fork, don't expect to easily be able to merge from
upstream for very long.
* Doesn't support old HTTP versions, web sockets, HTTP/2, old servers or uncommon network setups.

### Thanks, inspiration and resources

Inspiration taken from the following projects (I don't use the, but I learnt a lot from the source). Thanks! :
* [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)
* [pem](https://github.com/andris9/pem)

Splitter was ported to React from [bg-splitter](https://github.com/blackgate/bg-splitter). Thanks!
My port isn't polished enough to warrant its own repo, but if anyone is interested, I can do so.

### License

The MIT License (MIT)

Copyright (c) 2015 Francois Ward

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
