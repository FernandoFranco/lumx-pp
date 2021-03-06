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
                toolbarMenu: '=',
                toolbarTheme: '@',
                toolbarTitle: '@',
                toolbarBackButton: '=',

                configMenus: '=',
                navigatorMenus: '=',

                drawerUsers: '=',
                drawerBackground: '@'
            },
            template:'<div class="drawerlayout" ng-class="{\'drawer-active\': active}"><lx-toolbar back-button="toolbarBackButton" menus="toolbarMenu" bgc="{{toolbarBgc}}" theme="{{toolbarTheme}}" title="{{toolbarTitle}}" toggle-handler="setActive();"></lx-toolbar><div id="lxpp-navigator" ng-click="active = (drawerType === \'temporary\') ? !active : active;"><div ng-click="stopPropagation($event);" layout="column" item><div layout="column" overflow="hidden" item><div overflow="auto" lx-scroll><lx-drawer-user users="drawerUsers" background="{{drawerBackground}}" min-drawer="drawerType !== \'temporary\'"></lx-drawer-user><lx-drawer-navigator id="menu" menus="navigatorMenus"></lx-drawer-navigator></div></div><div class="config-menus" ng-if="configMenus"><lx-drawer-navigator id="config" menus="configMenus"></lx-drawer-navigator></div></div></div><div id="lxpp-content"><div overflow="scroll" lx-scroll ng-transclude></div></div></div>'
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $scope.$watch('configMenus', _onChangeConfigMenus);
            $rootScope.$on('drawer:active', _onDrawerActive);

            $scope.setActive = _setActive;
            $scope.stopPropagation = _stopPropagation;

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeConfigMenus(newConfigMenus) {
                if (newConfigMenus && newConfigMenus[0] && !newConfigMenus[0].items) {
                    $scope.configMenus = [{items: newConfigMenus}];
                }
            }

            function _onDrawerActive($event, active) {
                $scope.active = active;
            }

            function _setActive() {
                if ($scope.toolbarBackButton) {
                    return $rootScope.$broadcast('drawer:toolbar:back');
                }

                $rootScope.$broadcast('drawer:active', true);
            }

            function _stopPropagation($event) {
                $event.preventDefault();
                $event.stopPropagation();
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

    lxDrawerNavigator.$inject = ['$rootScope'];

    function lxDrawerNavigator($rootScope) {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            scope: {
                menus: '='
            },
            template:'<div class="drawernavigator mt mb"><ul class="list" ng-repeat="group in menus"><li class="list-subheader" ng-bind="group.header"></li><li ng-repeat="item in group.items" class="list-row list-row--is-clickable" lx-ripple="black" ng-click="navigateHandler(item);"><div class="list-row__primary" ng-if="item.icon || item.avatar"><img ng-src="{{item.avatar}}" ng-if="item.avatar" width="40" height="40" class="img-round"><lx-icon ng-if="!item.avatar" lx-id="{{item.icon}}" lx-size="s" lx-color="{{item.iconColor || \'grey\'}}" lx-type="flat"></lx-icon></div><div class="list-row__content"><span>{{item.label}}</span></div><div class="list-row__secondary" ng-if="item.info"><lx-icon lx-id="{{item.info}}" lx-size="xs" lx-color="{{item.infoColor || \'grey\'}}" lx-type="flat"></lx-icon></div></li></ul></div>'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            var tempActive = false;
            var orinalMenu = [];

            $scope.navigateHandler = _navigateHandler;

            $scope.$watch('menus', _onChangeMenus);
            $rootScope.$on('drawernavigator:' + $attrs.id + ':temp', _onTempMenu);
            $rootScope.$on('drawernavigator:' + $attrs.id + ':original', _onOriginalMenu);

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeMenus(newMenus) {
                if (!tempActive) {
                    orinalMenu = newMenus;
                }
            }

            function _onTempMenu($event, tempMenu) {
                tempActive = true;
                $scope.menus = tempMenu;
            }

            function _onOriginalMenu() {
                tempActive = false;
                $scope.menus = orinalMenu;
            }

            function _navigateHandler(menuItem) {
                if (menuItem.handler) {
                    if (menuItem.handler()) {
                        $rootScope.$broadcast('drawer:active', false);
                    }
                }
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive DrawerToolbar
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxToolbar', lxToolbar);

    lxToolbar.$inject = [];

    function lxToolbar() {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            scope: {
                bgc: '@',
                title: '@',
                theme: '@',
                menus: '=',
                backButton: '=',
                toggleHandler: '&'
            },
            template:'<div id="lxpp-toolbar"><div class="toolbar z4" ng-class="bgc"><div class="toolbar__left"><lx-button class="toogle-button mr" lx-size="l" lx-color="{{themeObj.color}}" lx-type="icon" ng-click="toggleHandler();"><i class="mdi" ng-class="{\'mdi-menu\': !backButton, \'mdi-arrow-left\': backButton}"></i></lx-button></div><span class="ml toolbar__label fs-title {{themeObj.textColor}}" ng-bind="title"></span><div class="toolbar__right"><lx-dropdown lx-position="right" lx-over-toggle="true" ng-if="overflow.length > 0"><lx-dropdown-toggle><lx-button lx-size="l" lx-color="{{themeObj.color}}" lx-type="icon"><i class="mdi mdi-dots-vertical"></i></lx-button></lx-dropdown-toggle><lx-dropdown-menu><ul><li ng-repeat="menu in overflow"><a class="dropdown-link"><i class="mdi mdi-delete"></i> <span ng-bind="menu.title"></span></a></li></ul></lx-dropdown-menu></lx-dropdown></div></div></div>'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $attrs.$observe('theme', _onChangeTheme);
            $scope.$watch('menus', _onChangeMenus);

            $scope.overflow = [];
            $scope.actions = [];

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeTheme(newTheme) {
                $scope.themeObj = {
                    color: newTheme === 'dark' ? 'white' : 'black',
                    textColor: newTheme === 'dark' ? 'tc-white' : 'tc-black',
                };
            }

            function _onChangeMenus(newMenus) {
                if (!newMenus) {
                    return;
                }

                $scope.actions = [];
                $scope.overflow = [];

                if (!(newMenus instanceof Array)) {
                    newMenus = [newMenus];
                }

                for (var i = 0; i < newMenus.length; i++) {
                    var menu = newMenus[i];

                    if (menu.showAsAction.indexOf('never') >= 0) {
                        $scope.overflow.push(menu);
                        continue;
                    }

                    $scope.actions.push(menu);
                }
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive Userlayout
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxDrawerUser', lxDrawerUser);

    lxDrawerUser.$inject = ['$rootScope'];

    function lxDrawerUser($rootScope) {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            scope: {
                users: '=',
                minDrawer: '=',
                background: '@'
            },
            template:'<div ng-class="{\'min\': minDrawer}" id="drawer-user" ng-click="toggleUsers();"><div class="drawer-user__max"><img class="user-background" ng-src="{{background}}"> <img class="user-avatar z1" ng-src="{{user.image}}"></div><div class="toolbar bgc-white"><div class="toolbar__left mr+"><img class="user-avatar z1" ng-src="{{user.image}}"></div><div class="toolbar__label"><span class="fs-body-2" ng-bind="user.name"></span><lx-icon lx-id="{{menuIcon}}" lx-size="s" lx-color="grey" lx-type="flat"></lx-icon></div><div class="toolbar__right"><lx-button class="toogle-button" lx-size="l" lx-color="grey" lx-type="icon" ng-click="hideDrawer($event);"><i class="mdi mdi-chevron-left"></i></lx-button></div></div></div>'
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            var menuDown = 'menu-down';
            var menuUp = 'menu-up';
            var showUsers = false;

            $scope.user = null;
            $scope.menuIcon = menuDown;

            $scope.hideDrawer = _hideDrawer;
            $scope.toggleUsers = _toggleUsers;

            $scope.$watch('users', _onChangeUsers);

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _onChangeUsers(newUsers) {
                if (!newUsers) {
                    $scope.user = null;
                    return;
                }

                if (!(newUsers instanceof Array)) {
                    $scope.users = [newUsers];
                }

                $scope.users.forEach(function (user) {
                    if (user.active) {
                        $scope.user = user;
                    }
                });

                if (!$scope.user) {
                    $scope.user = $scope.users[0] || null;
                }
            }

            function _toggleUsers() {
                if (showUsers) {
                    showUsers = false;
                    $scope.menuIcon = menuDown;
                    return $rootScope.$broadcast('drawernavigator:menu:original');
                }

                var tempMenu = [];
                $scope.users.forEach(function (user) {
                    if (user !== $scope.user) {
                        tempMenu.push({
                            label: user.name,
                            avatar: user.image,
                            handler: function _changeUser() {
                                showUsers = false;
                                $scope.user = user;
                                $scope.menuIcon = menuDown;
                                $rootScope.$broadcast('drawernavigator:menu:original');
                                $rootScope.$broadcast('draweruser:changeuser', user);
                            }
                        });
                    }
                });

                showUsers = true;
                $scope.menuIcon = menuUp;
                $rootScope.$broadcast('drawernavigator:menu:temp', [{
                    items: tempMenu
                }]);
            }

            function _hideDrawer($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $rootScope.$broadcast('drawer:active', false);
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive Expand Item
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxExpandItem', lxExpandItem);

    lxExpandItem.$inject = ['$timeout'];

    function lxExpandItem($timeout) {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                lxIcon: '@',
                lxMenu: '=?',
                lxLabel: '@',
                lxActive: '=?',
                lxMenuItem: '=?',
                lxIconColor: '@',
                lxToggleActive: '&?'
            },
            template:'<div class="lx-expand-list" ng-class="{\'lx-el__min\': !active}" ng-click="toggleActive($event, active);"><div class="toolbar" lx-ripple="black"><div class="toolbar__left mr+" ng-if="!!lxIcon"><lx-icon lx-id="{{lxIcon}}" lx-size="{{!!active ? \'m\' : \'s\'}}" lx-color="{{lxIconColor || \'grey\'}}" lx-type="flat"></lx-icon></div><span class="toolbar__label fs-title">{{lxLabel}}</span><div class="toolbar__right ml+" ng-click="preventStop($event);"><lx-button lx-size="m" lx-color="black" lx-type="icon" ng-repeat="menu in lxMenu" ng-disabled="menu.disable" ng-click="menuHandler($event, menu);"><i class="mdi mdi-{{menu.icon}}"></i></lx-button></div></div><div class="lx-el__content" ng-click="preventStop($event);" ng-transclude></div></div>'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            var content = $element.find('.lx-el__content');

            $scope.preventStop = _preventStop;
            $scope.menuHandler = _menuHandler;
            $scope.toggleActive = _toggleActive;

            $scope.$watch(_checkMaxHeight, _changeMaxHeight);
            $scope.$watch('lxActive', _onChangeActive);

            _init();

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _init() {
                $scope.active = !!$scope.lxActive;
            }

            function _preventStop($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }

            function _menuHandler($event, menu) {
                menu.handler($event, menu, $scope.lxMenuItem);
            }

            function _toggleActive($event, lxSelected) {
                $scope.active = $scope.lxToggleActive({
                    $event: $event,
                    selected: lxSelected
                });
            }

            function _checkMaxHeight() {
                return content[0].scrollHeight;
            }

            function _changeMaxHeight(newHeight) {
                content.css({
                    maxHeight: newHeight
                });
            }

            function _onChangeActive(newActive) {
                $scope.active = newActive;
            }
        }
    }
})(angular);
/**
 * Fernando Franco
 * Directive Expand List
 */
(function (angular) {
    'use strict';
    angular.module('lxpp').directive('lxExpandList', lxExpandList);

    lxExpandList.$inject = [];

    function lxExpandList() {
        return {
            link: _link,
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                lxData: '=',
                lxSelected: '=?',

                lxIcon: '@',
                lxMenu: '=?',
                lxIconColor: '@'
            },
            template:'<div class="p"><lx-expand-item class="bgc-white" ng-repeat="data in lxData" lx-label="{{data.label}}" lx-icon="{{data.icon || lxIcon}}" lx-icon-color="{{data.iconColor || lxIconColor}}" lx-menu="(data.menu || lxMenu)" lx-toggle-active="toggleActive($event, selected, data);" lx-active="(lxSelected == data)"><div ng-transclude></div></lx-expand-item></div>'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {

            $scope.toggleActive = _toggleActive;

            _init();

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _init() {
                $scope.lxSelected = $scope.lxSelected || null;
            }

            function _toggleActive($event, lxSelected, data) {
                $scope.lxSelected = data;
                return !lxSelected;
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

    lxScroll.$inject = ['$timeout'];

    function lxScroll($timeout) {
        return {
            link: _link,
            restrict: 'A'
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        function _link($scope, $element, $attrs, $ctrl, $transclude) {
            $scope.$watch(_checkWidthChange, _onResize);
            $scope.$watch(_checkHeightChange, _onResize);

            _init();

            ////////////////////////////////////////////////////////////////////////////////////////////////

            function _init() {
                $timeout(function() {
                    $element.scrollbar();
                }, 1000);
            }

            function _checkWidthChange() {
                return $element.width();
            }

            function _checkHeightChange() {
                return $element.height();
            }

            function _onResize() {
                $element.scrollbar();
            }
        }
    }
})(angular);
//# sourceMappingURL=lxpp.js.map
