/**
 * Fernando Franco
 * Angular Module
 */
(function (angular) {
    'use strict';
    angular.module('lxpp', ['lumx']);

    angular.module('lxpp').run(lxppRun);

    lxppRun.$inject = [];

    function lxppRun() {
        
    }
})(angular);
/**
 * Fernando Franco
 * Directive Drawerlayout
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxDrawerLayout', lxDrawerLayout);

    lxDrawerLayout.$inject = ['$rootScope'];

    function lxDrawerLayout($rootScope) {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                drawerType: '@',
                toolbarBgc: '@',
                toolbarTheme: '@',
                navigatorMenus: '='
            },
            template:'<div class="drawerlayout" ng-class="{\'drawer-active\': active}"><div id="lxpp-toolbar"><div class="toolbar z4" ng-class="toolbarBgc"><div class="toolbar__left"><lx-button class="toogle-button mr" lx-size="l" lx-color="{{toolbarThemeObj.color}}" lx-type="icon" ng-click="active = !active;"><i class="mdi mdi-menu"></i></lx-button></div><span class="ml toolbar__label fs-title {{toolbarThemeObj.textColor}}">Lorem Ipsum</span></div></div><div id="lxpp-navigator" ng-click="active = (drawerType === \'temporary\') ? !active : active;"><div overflow="auto" lx-scroll><div id="navigator-toolbar" class="toolbar bgc-white"><span class="toolbar__label fs-title tc-white"></span><div class="toolbar__right"><lx-button class="toogle-button" lx-size="l" lx-color="grey" lx-type="icon" ng-click="active = !active;"><i class="mdi mdi-chevron-left"></i></lx-button></div></div><lx-drawer-navigator menus="navigatorMenus"></lx-drawer-navigator></div></div><div id="lxpp-content"><div overflow="scroll" lx-scroll ng-transclude></div></div></div>'
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $attrs.$observe('toolbarTheme', _onChangeToolbarTheme);

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeToolbarTheme(newTheme) {
                $scope.toolbarThemeObj = {
                    color: newTheme === 'dark' ? 'white' : 'black',
                    textColor: newTheme === 'dark' ? 'tc-white' : 'tc-black',
                };
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive DrawerNavigator
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxDrawerNavigator', lxDrawerNavigator);

    lxDrawerNavigator.$inject = [];

    function lxDrawerNavigator() {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            scope: {
                menus: '='
            },
            template:'<div class="drawernavigator mt mb"><ul class="list" ng-repeat="(header, menu) in menus"><li class="list-subheader" ng-bind="header"></li><li ng-repeat="item in menu" class="list-row list-row--is-clickable" lx-ripple="black"><div class="list-row__primary" ng-if="item.icon"><lx-icon lx-id="{{item.icon}}" lx-size="s" lx-color="{{item.iconColor || \'grey\'}}" lx-type="flat"></lx-icon></div><div class="list-row__content">{{item.label}}</div><div class="list-row__secondary" ng-if="item.info"><lx-icon lx-id="{{item.info}}" lx-size="xs" lx-color="{{item.infoColor || \'grey\'}}" lx-type="flat"></lx-icon></div></li></ul></div>'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $scope.$watch('menus', _onChangeNavigatorMenu);

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeNavigatorMenu(newMenu, a, b, c) {
                if (newMenu instanceof Array) {
                    $scope.menus = {
                        '': newMenu
                    };
                }
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive Scrollbar
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxScroll', lxScroll);

    lxScroll.$inject = [];

    function lxScroll() {
        return {
            link: _link,
            restrict: 'A'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $element.scrollbar();
        }
    }
})(angular);
//# sourceMappingURL=lxpp.js.map
