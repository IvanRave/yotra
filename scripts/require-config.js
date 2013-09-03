define([], function () {
    requirejs.config({
        baseUrl: '/scripts',
        paths: {
            'moment': 'moment.min', // no deps
            'angular': 'angular.min',
            'angular-route': 'angular-route.min',
            'angular-resource': 'angular-resource.min'
        },
        shim: {
            // Shim config does not work after optimization builds with CDN resources.
            // Need only for 3-rd side libraries when no AMD
            // bootstrap - set module define it it's file
            // or exports as jquery
            'angular': { exports: 'angular' }, // work: angular.module and other
            'angular-route': { deps: ['angular'] },
            'angular-resource': { deps: ['angular'] }
        }
        // need define or exports for each module
        // enforceDefine: true
    });
});