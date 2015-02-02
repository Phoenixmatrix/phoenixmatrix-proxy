PhoenixMatrix web development proxy
===================================

_v0.1 technical preview_

Web debugging proxy in the spirit of Fiddler and Charles Proxy, written in JavaScript with [nw.js](http//nwjs.io/)
and node.

Tested on MacOSX Yosemite, Windows 8.1 and Ubuntu 14, with caveats*

## Warning: Technical Preview
This is a technical preview at best!!

The UI is far from finished, the code is a mess, there's a lot of bugs. Expect crashes, slowness, and generally an
unfinished product feel. It 'works' when stars are aligned, and that's as much as you should expect.

Again, the code is a mess. Please don't look at it and email me that its bad. For now my priority was to get things working.

### Features

![PhoenixMatrix web development proxy](/doc/example.png?raw=true "See what happens behind the scene")

* Works on  all major browsers
* Works on all operating systems that nw.js supports
* Supports both http and https
* Allows real time https decryption with no scary warning (not even from Chrome!)
* Handles gzipped responses (doesn't yet decode base65 encoded bodies though. That's coming)
* Dynamically creates its own certificates for https decryption. No need to fiddle with OpenSSL! (though you do need to have it installed)
* Free and open source the MIT license. Feel free to hack it up.
* Built on open web technology. JavaScript, CSS, node.js.
* Uses the latest EcmaScript 6 features.

### Setup
* Clone this repo
* Open a command prompt and navigate to the location where you cloned it.
* Run `npm install` (on Windows, you will get some kexec errors preceded with the message "optional dep failed, continuing".
 This is ok, things will work anyway.
* Run `gulp`
* You should now see the inspector. Setup the proxy in your browser of choice (or in your application), and you're good to go!
* From now on you can use `npm start` to run PhoenixMatrix without rebuilding everything.

### Configuring your browser to use the proxy

Different browsers and operating systems use different methods of configuring proxies. For IE, Safari and Chrome in Windows and MacOSX, configure
the proxy from the system settings/control panel. For FireFox, configure the proxy in the options -> advanced under network. The default port is 3002 but
can be configured

Exclude SSl/HTTPS from using the proxy if you don't need it and/or don't want to go through the steps to configure a certificate for man-in-the-middle decryption.

For https support, after running PhoenixMatrix, look in the certificate folder where you cloned the repo. Import `ca.crt` in your browser (Firefox)
or as a system certificate for most other browsers/operating systems. If prompted, the certificate only need to be used for websites. On Windows, the certificate needs to
be configured in the Trusted Certificate Authorities (you can just double click the certificate to launch the wizard).

PhoenixMatrix uses a certificate authority to generate individual server certificates, so only the one certificate needs to be installed.

### Configuration

The available options can be found in phoenixmatrix.json, in JSON format (duh!).
* `includeConnect`: if you want to see http CONNECT requests, which will happen whenever you try to make an https request while using the proxy.
* `proxyPort`: used to configure which port the proxy listens to. Make sure to use a free port. Default to 3002.
* `httpsProxyPort`: used to configure on which port the https proxy listens to. This is only used internally and will not work
if you point your browser to it directly.
* `certificateExpiration`: how many days should the generated certificates be valid for

### Caveats
* On MacOSX, when using the trackpad, scrolling isn't as smooth as it should be.
* On newer versions of Ubuntu, or any distribution lacking libudev.so.0 (ie: with libudev.so.1 installed), see
[this link](https://github.com/nwjs/nw.js/wiki/The-solution-of-lacking-libudev.so.0) on how to get things running.
* On windows, make sure you have OpenSSL installed, and it is in the path. Using [Git Bash](http://git-scm.com/downloads)
will do the trick too.
* As of the technical preview, it is not possible to directly disable https support. If you don't want to setup the certificate, ensure your browser is not
configured to use the proxy for HTTPS if you do not want it to stop you from browsing https sites during development.
* The proxy currently only checks individual server certificate expiration dates to regenerate them. If you get an error that the CA certificate isn't valid
even though you imported it, just delete the content of the certificate folder, restart PhoenixMatrix and import ca.crt again
* Expect the code to change a LOT from now on. This was hacked up quickly to get things working. If you make a fork, don't expect to easily be able to merge from
upstream for very long.
* Doesn't support old HTTP versions, servers or uncommon network setups.

Inspiration taken from the following projects. Thanks! :
* [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)
* [pem](https://github.com/andris9/pem)

### License

The MIT License (MIT)

Copyright (c) [year] [fullname]

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
