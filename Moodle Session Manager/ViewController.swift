//
//  ViewController.swift
//  Moodle Session Manager
//
//  Created by Samuel Kreyenbühl on 29.09.2024.
//

import Cocoa
import SafariServices
import WebKit

let extensionBundleIdentifier = "com.samkry.Moodle-Session-Manager-Safari.Extension"
let supportURL = URL(string: "https://github.com/SamKry/Moodle-Session-Manager")!

class ViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler {
    
    @IBOutlet weak var webView: WKWebView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show(\(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show(\(state.isEnabled), false)")
                }
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.body as! String == "open-preferences" {
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                DispatchQueue.main.async {
                    NSApplication.shared.terminate(nil)
                }
            }
        } else if message.body as! String == "open-url" {
            NSWorkspace.shared.open(supportURL)
        }
    }


}
