import UIKit
import LineSDK
import FirebaseAuth
import PromiseKit
import SVProgressHUD

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        LineSDKLogin.sharedInstance().delegate = self
    }

    @IBAction func tapLineLoginButton(_ sender: UIButton) {
        NSLog("tapLineLoginButton")
        SVProgressHUD.show()
        LineSDKLogin.sharedInstance().start()
    }
}

extension ViewController: LineSDKLoginDelegate {
    func didLogin(_ login: LineSDKLogin, credential: LineSDKCredential?, profile: LineSDKProfile?, error: Error?) {
        if let error = error {
            SVProgressHUD.showError(withStatus: "Login Error:\n" + error.localizedDescription)
            return
        }

        guard let lineSDKAccessToken = credential?.accessToken else {
            NSLog("Couldn't get lineSDKAccessToken")
            SVProgressHUD.showError(withStatus: "Login Error")
            return
        }

        firstly(execute: { () -> Promise<(Data, URLResponse)> in
            guard let googleServiceInfoPath = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
                let googleServiceInfoDictionary = NSDictionary(contentsOfFile: googleServiceInfoPath),
                let projectId = googleServiceInfoDictionary["PROJECT_ID"] as? String
                else {
                return Promise(error: GoogleServiceInfoError.notFoundValidGoogleServiceInfoPlist)
            }

            let url: URL = URL(string: "https://us-central1-" + projectId + ".cloudfunctions.net/api/auth/line_login/client/custom_token")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")

            request.httpBody = try! JSONEncoder().encode(LineCustomTokenRequest(line_access_token: lineSDKAccessToken.accessToken))

            return URLSession.shared.dataTask(with: request).asDataAndResponse()

        }).then(execute: { (data, response) -> (Promise<User>) in
            let lineCustomTokenResponse = try! JSONDecoder().decode(LineCustomTokenResponse.self, from: data)
            return Auth.auth().signInPromise(withCustomToken: lineCustomTokenResponse.firebase_token)

        }).then(execute: { (user: User) -> Void in
            let message = "signed in successfully.\n\n"
                + "displayName: " + (user.displayName ?? "(No displayName)") + "\n"
            SVProgressHUD.showSuccess(withStatus: message)

        }).catch(execute: { (error) in
            SVProgressHUD.showError(withStatus: "Login Error:\n" + error.localizedDescription)
        })

    }
}

enum GoogleServiceInfoError: Error {
    case notFoundValidGoogleServiceInfoPlist
}

