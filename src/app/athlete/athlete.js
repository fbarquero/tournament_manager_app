/**
 * Created by it on 6/23/2014.
 */
/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.athlete', [
    'ui.router', 'ngTable'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config( $stateProvider, $httpProvider ) {
        $stateProvider.state( 'athlete', {
            url: '/athlete',
            views: {
                "main": {
                    controller: 'AthleteCtrl',
                    templateUrl: 'athlete/athlete.tpl.html'
                }
            },
            data:{ pageTitle: 'Athlete' }
        });

        $httpProvider.defaults.useXDomain = true;
        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
        //delete $http.defaults.headers.common['X-Requested-With'];
    })

/**
 * And of course we define a controller for our route.
 */
    .controller( 'AthleteCtrl',function AthleteController( $scope, $http, ngTableParams, $filter ) {
        var data = [
        ];
        $scope.data = data;

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            filter: {
                //name: 'M'       // initial filter
            },
            sorting: {
                //name: 'asc'     // initial sorting
            }
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var filteredData = params.filter() ?
                    $filter('filter')(data, params.filter()) :
                    data;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    data;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.changeSelection = function(user) {
            // console.info(user);
        };
    });

