I keep getti ng cors error:

A site requested a resource from a network that it could only access because of its users' privileged network position. These requests expose devices and servers to the internet, increasing the risk of a cross-site request forgery (CSRF) attack, and/or information leakage.
To mitigate these risks, Chrome will require non-public subresources to opt-into being accessed with a preflight request and will start blocking them in Chrome 130 (October 2024).
To fix this issue, ensure that response to the preflight request for the private network resource has the Access-Control-Allow-Private-Network header set to true.
Administrators can make use of the InsecurePrivateNetworkRequestsAllowed and InsecurePrivateNetworkRequestsAllowedForUrls enterprise policies to temporarily disable this restriction on all or certain websites.

In my Headers the Access-Control-Allow-Private-Network is set to true. I have a suspicion that the root of the problem is server response which is 204 instead of 200. I tried to cheang the call in all places possible, but I have no Idea how to do it.