import Firebase
import PromiseKit

extension Auth {
    func signInPromise(withCustomToken customToken: String) -> Promise<User> {
        return PromiseKit.wrap({ resolve in
            Auth.auth().signIn(withCustomToken: customToken, completion: resolve)
        })
    }
}
