angular.module('vk-constants-module', [])
    .constant('vk-constants', {
        clientId: 3690013,
        scope: 1,
        redirectUrl: 'http://localhost:9001/external-logon.html',
        v: 5.5,
        display: 'popup',
        codeResponseStorage: 'vk_code_response'
    });
