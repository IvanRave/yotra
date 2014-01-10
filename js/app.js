/* some header comment in app.js */
angular.module('project', ['app-helper-module', 'vk-constants-module'])
    .config(['$locationProvider', function () {

    }])
    .run(['$rootScope', '$window', '$interval', 'app-helper', 'vk-constants', function (rootScope, angWindow, angInterval, appHelper, vk) {
        $(function () {            
            function op() {
                function checkVkCode() {
                    console.log('');
                    // Check localStorage
                    var vkCodeResponse = localStorage.getItem(vk.codeResponseStorage);
                    if (vkCodeResponse) {
                        angInterval.cancel(vkCodeInterval);

                        console.log(appHelper.searchParams(vkCodeResponse));

                        // Handle code response
                        var code = appHelper.searchParams(vkCodeResponse)['code'];
                        if (code) {
                            console.log(code);
                            // Sent code to the site server
                            // Change code to access_token
                            // Build auth
                        }
                        else
                        {
                         // Just hide auth loader
                        }
                    }
                }

                // Clean previous code storage record
                localStorage.removeItem(vk.codeResponseStorage);

                var vkCodeInterval = angInterval(checkVkCode, 1000);

                var vkAuthUrl = 'https://oauth.vk.com/authorize?client_id=' + vk.clientId + '&scope=' + vk.scope + '&redirect_uri=' + encodeURIComponent(vk.redirectUrl) + '&v=' + vk.v + '&display=' + vk.display;
                angWindow.open(vkAuthUrl, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=400, top=200, left=400");
            }
            
            rootScope.openVkAuth = op;
        });
    }]);